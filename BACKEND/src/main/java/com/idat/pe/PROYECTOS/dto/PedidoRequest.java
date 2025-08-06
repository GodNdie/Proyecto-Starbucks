package com.idat.pe.PROYECTOS.dto;

import lombok.Data;

import java.util.List;

@Data
public class PedidoRequest {
    private Long cafeId;
    private List<Long> ingredientesIds;
    private List<Long> personalizacionesIds;
    private Long localId;
    private Long metodoPagoId;
    private String temperatura; // "caliente" o "frio"
}
