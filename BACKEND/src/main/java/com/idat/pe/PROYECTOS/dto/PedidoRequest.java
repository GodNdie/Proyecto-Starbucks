package com.idat.pe.PROYECTOS.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PedidoRequest {
    private Long cafeId;
    private Integer cantidad;
    private List<Long> ingredientesIds = new ArrayList<>();
    private List<Long> personalizacionesIds = new ArrayList<>();
    private Long localId;
    private Long metodoPagoId;
    private String temperatura; // "caliente" o "frio"
}
