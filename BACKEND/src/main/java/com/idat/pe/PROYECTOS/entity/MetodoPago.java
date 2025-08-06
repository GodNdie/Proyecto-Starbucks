package com.idat.pe.PROYECTOS.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "metodos_pago")
public class MetodoPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String plataforma; // visa, yape, etc.
    private String numeroTarjeta;
    private String iconoUrl;

    @ManyToOne
    private Usuario usuario;
}
