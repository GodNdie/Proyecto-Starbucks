package com.idat.pe.PROYECTOS.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cafes")
@Data
public class Cafe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String descripcion;

    private Double precio;
}