package com.idat.pe.PROYECTOS.controller;

import com.idat.pe.PROYECTOS.dto.PedidoRequest;
import com.idat.pe.PROYECTOS.dto.PedidoResumenResponse;
import com.idat.pe.PROYECTOS.security.JWTUtil;
import com.idat.pe.PROYECTOS.service.PedidoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private JWTUtil jwtUtil;

    @PostMapping
    public ResponseEntity<String> crearPedido(@Valid @RequestBody PedidoRequest request, HttpServletRequest httpRequest) {
        String token = obtenerTokenDesdeHeader(httpRequest);
        String correo = jwtUtil.extractUsername(token);

        pedidoService.registrarPedido(request, correo);

        return ResponseEntity.ok("Pedido registrado correctamente");
    }

    private String obtenerTokenDesdeHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        throw new RuntimeException("Token JWT no proporcionado");
    }
    @GetMapping("/historial")
    public ResponseEntity<List<PedidoResumenResponse>> verHistorial(HttpServletRequest httpRequest) {
        String token = obtenerTokenDesdeHeader(httpRequest);
        String correo = jwtUtil.extractUsername(token);

        List<PedidoResumenResponse> historial = pedidoService.obtenerHistorial(correo);
        return ResponseEntity.ok(historial);
    }
    @PostMapping("/repetir/{id}")
    public ResponseEntity<String> repetirPedido(@PathVariable Long id, HttpServletRequest httpRequest) {
        String token = obtenerTokenDesdeHeader(httpRequest);
        String correo = jwtUtil.extractUsername(token);

        pedidoService.repetirPedido(id, correo);
        return ResponseEntity.ok("Pedido repetido con éxito");
    }
}
