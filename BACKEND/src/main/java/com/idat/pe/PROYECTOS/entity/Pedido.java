package com.idat.pe.PROYECTOS.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuario;

    @ManyToOne
    private Cafe cafe;

    @ManyToOne
    private Local local;

    @ManyToOne
    @JoinColumn(name = "metodo_pago_id")
    private MetodoPago metodoPago;

    private String temperatura;
    private String estado = "pendiente";
    private LocalDateTime fechaPedido = LocalDateTime.now();
    private double total;
}
