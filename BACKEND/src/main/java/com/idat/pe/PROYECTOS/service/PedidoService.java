package com.idat.pe.PROYECTOS.service;

import com.idat.pe.PROYECTOS.dto.PedidoRequest;
import com.idat.pe.PROYECTOS.entity.*;
import com.idat.pe.PROYECTOS.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.idat.pe.PROYECTOS.dto.PedidoResumenResponse;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CafeRepository cafeRepository;

    @Autowired
    private IngredienteRepository ingredienteRepository;

    @Autowired
    private PersonalizacionRepository personalizacionRepository;

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @Autowired
    private LocalRepository localRepository;

    @Autowired
    private PedidoIngredienteRepository pedidoIngredienteRepository;

    @Autowired
    private PedidoPersonalizacionRepository pedidoPersonalizacionRepository;

    @Transactional
    public void registrarPedido(PedidoRequest request, String correoUsuario) {
        // Usuario
        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Café (obligatorio)
        if (request.getCafeId() == null) throw new RuntimeException("cafeId requerido");
        Cafe cafe = cafeRepository.findById(request.getCafeId())
                .orElseThrow(() -> new RuntimeException("Café no encontrado"));

        // Cantidad (default 1 si no llega o llega <= 0)
        int cantidad = (request.getCantidad() != null && request.getCantidad() > 0)
                ? request.getCantidad() : 1;

        double totalUnitario = cafe.getPrecio();

        // Pedido base
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setCafe(cafe);
        pedido.setTemperatura(request.getTemperatura());
        pedido.setCantidad(cantidad);

        // Método de pago (opcional)
        if (request.getMetodoPagoId() != null) {
            MetodoPago mp = metodoPagoRepository.findById(request.getMetodoPagoId())
                    .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));
            pedido.setMetodoPago(mp);
        }

        // Local (opcional)
        if (request.getLocalId() != null) {
            Local local = localRepository.findById(request.getLocalId())
                    .orElseThrow(() -> new RuntimeException("Local no encontrado"));
            pedido.setLocal(local);
        }

        // Guardar para obtener ID
        pedido.setTotal(0);
        pedido = pedidoRepository.save(pedido);

        // Ingredientes (null-safe)
        List<Long> ingIds = (request.getIngredientesIds() != null) ? request.getIngredientesIds() : List.of();
        for (Long idIng : ingIds) {
            if (idIng == null) continue;
            Ingrediente ing = ingredienteRepository.findById(idIng)
                    .orElseThrow(() -> new RuntimeException("Ingrediente no encontrado: " + idIng));
            PedidoIngrediente pi = new PedidoIngrediente();
            pi.setPedido(pedido);
            pi.setIngrediente(ing);
            pedidoIngredienteRepository.save(pi);
            totalUnitario += ing.getPrecioAdicional();
        }

        // Personalizaciones (null-safe)
        List<Long> perIds = (request.getPersonalizacionesIds() != null) ? request.getPersonalizacionesIds() : List.of();
        for (Long idPer : perIds) {
            if (idPer == null) continue;
            Personalizacion p = personalizacionRepository.findById(idPer)
                    .orElseThrow(() -> new RuntimeException("Personalización no encontrada: " + idPer));
            PedidoPersonalizacion pp = new PedidoPersonalizacion();
            pp.setPedido(pedido);
            pp.setPersonalizacion(p);
            pedidoPersonalizacionRepository.save(pp);
            totalUnitario += p.getPrecioAdicional();
        }

        // Total final = (precio base + extras) * cantidad
        pedido.setTotal(totalUnitario * cantidad);
        pedidoRepository.save(pedido);
    }

    public List<PedidoResumenResponse> obtenerHistorial(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Pedido> pedidos = pedidoRepository.findByUsuario(usuario);
        List<PedidoResumenResponse> historial = new ArrayList<>();

        for (Pedido pedido : pedidos) {
            PedidoResumenResponse resumen = new PedidoResumenResponse();
            resumen.setPedidoId(pedido.getId());
            resumen.setCafe(pedido.getCafe().getNombre());
            resumen.setTemperatura(pedido.getTemperatura());
            resumen.setFecha(pedido.getFechaPedido());
            resumen.setTotal(pedido.getTotal());

            List<String> ingredientes = pedidoIngredienteRepository.findByPedido(pedido)
                    .stream().map(pi -> pi.getIngrediente().getNombre()).toList();

            List<String> personalizaciones = pedidoPersonalizacionRepository.findByPedido(pedido)
                    .stream().map(pp -> pp.getPersonalizacion().getTipo() + ": " + pp.getPersonalizacion().getValor()).toList();

            resumen.setIngredientes(ingredientes);
            resumen.setPersonalizaciones(personalizaciones);
            historial.add(resumen);
        }
        return historial;
    }

    @Transactional
    public void repetirPedido(Long pedidoId, String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedidoOriginal = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (!pedidoOriginal.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("No puedes repetir un pedido que no es tuyo");
        }

        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setUsuario(usuario);
        nuevoPedido.setCafe(pedidoOriginal.getCafe());
        nuevoPedido.setLocal(pedidoOriginal.getLocal());
        nuevoPedido.setMetodoPago(pedidoOriginal.getMetodoPago());
        nuevoPedido.setTemperatura(pedidoOriginal.getTemperatura());
        nuevoPedido.setCantidad(pedidoOriginal.getCantidad()); // mantiene cantidad
        nuevoPedido.setFechaPedido(LocalDateTime.now());
        nuevoPedido.setEstado("pendiente");
        nuevoPedido.setTotal(pedidoOriginal.getTotal());

        pedidoRepository.save(nuevoPedido);

        // Copiar ingredientes
        List<PedidoIngrediente> ingredientesOriginales = pedidoIngredienteRepository.findByPedido(pedidoOriginal);
        for (PedidoIngrediente original : ingredientesOriginales) {
            PedidoIngrediente nuevo = new PedidoIngrediente();
            nuevo.setPedido(nuevoPedido);
            nuevo.setIngrediente(original.getIngrediente());
            pedidoIngredienteRepository.save(nuevo);
        }

        // Copiar personalizaciones
        List<PedidoPersonalizacion> personalizacionesOriginales = pedidoPersonalizacionRepository.findByPedido(pedidoOriginal);
        for (PedidoPersonalizacion original : personalizacionesOriginales) {
            PedidoPersonalizacion nuevo = new PedidoPersonalizacion();
            nuevo.setPedido(nuevoPedido);
            nuevo.setPersonalizacion(original.getPersonalizacion());
            pedidoPersonalizacionRepository.save(nuevo);
        }
    }
}
