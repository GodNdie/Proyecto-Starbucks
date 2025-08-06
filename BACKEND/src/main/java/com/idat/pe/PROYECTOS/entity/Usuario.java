package com.idat.pe.PROYECTOS.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String correo;
    private String dni;
    private String telefono;

    @Column(name = "contrasena_hash")
    private String contrasenaHash;

    private LocalDateTime fecharegistro = LocalDateTime.now();
}
