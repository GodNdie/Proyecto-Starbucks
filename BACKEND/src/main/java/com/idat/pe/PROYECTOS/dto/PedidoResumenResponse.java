package com.idat.pe.PROYECTOS.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PedidoResumenResponse {
    private Long pedidoId;
    private String cafe;
    private String temperatura;
    private List<String> ingredientes;
    private List<String> personalizaciones;
    private LocalDateTime fecha;
    private double total;
}
