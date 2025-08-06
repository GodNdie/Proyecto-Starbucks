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

    public void registrarPedido(PedidoRequest request, String correoUsuario) {
        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Cafe cafe = cafeRepository.findById(request.getCafeId())
                .orElseThrow(() -> new RuntimeException("Café no encontrado"));

        MetodoPago metodoPago = metodoPagoRepository.findById(request.getMetodoPagoId())
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));

        Local local = localRepository.findById(request.getLocalId())
                .orElseThrow(() -> new RuntimeException("Local no encontrado"));

        double total = cafe.getPrecio();

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setCafe(cafe);
        pedido.setMetodoPago(metodoPago);
        pedido.setLocal(local);
        pedido.setTemperatura(request.getTemperatura());
        pedido.setTotal(0); // se calculará después
        pedido = pedidoRepository.save(pedido);

        // INGREDIENTES ADICIONALES
        if (request.getIngredientesIds() != null) {
            List<Ingrediente> ingredientes = ingredienteRepository.findAllById(request.getIngredientesIds());
            for (Ingrediente ingrediente : ingredientes) {
                PedidoIngrediente pi = new PedidoIngrediente();
                pi.setPedido(pedido);
                pi.setIngrediente(ingrediente);
                pedidoIngredienteRepository.save(pi);
                total += ingrediente.getPrecioAdicional();
            }
        }

        // PERSONALIZACIONES
        if (request.getPersonalizacionesIds() != null) {
            List<Personalizacion> personalizaciones = personalizacionRepository.findAllById(request.getPersonalizacionesIds());
            for (Personalizacion p : personalizaciones) {
                PedidoPersonalizacion pp = new PedidoPersonalizacion();
                pp.setPedido(pedido);
                pp.setPersonalizacion(p);
                pedidoPersonalizacionRepository.save(pp);
                total += p.getPrecioAdicional();
            }
        }

        // Actualizar el total en el pedido
        pedido.setTotal(total);
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
                    .stream()
                    .map(pi -> pi.getIngrediente().getNombre())
                    .toList();

            List<String> personalizaciones = pedidoPersonalizacionRepository.findByPedido(pedido)
                    .stream()
                    .map(pp -> pp.getPersonalizacion().getTipo() + ": " + pp.getPersonalizacion().getValor())
                    .toList();

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

        // Verifica que el pedido pertenece al usuario
        if (!pedidoOriginal.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("No puedes repetir un pedido que no es tuyo");
        }

        // Crear nuevo pedido
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setUsuario(usuario);
        nuevoPedido.setCafe(pedidoOriginal.getCafe());
        nuevoPedido.setLocal(pedidoOriginal.getLocal());
        nuevoPedido.setMetodoPago(pedidoOriginal.getMetodoPago());
        nuevoPedido.setTemperatura(pedidoOriginal.getTemperatura());
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
