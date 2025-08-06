package com.idat.pe.PROYECTOS.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UsuarioPerfilResponse {
    private String nombre;
    private String apellido;
    private String correo;
    private String dni;
    private String telefono;
    private LocalDateTime fechaRegistro;
}
