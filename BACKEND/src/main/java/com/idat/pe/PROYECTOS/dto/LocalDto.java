package com.idat.pe.PROYECTOS.dto;


import com.idat.pe.PROYECTOS.entity.Local;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocalDto {
    private Long id;
    private String nombre;
    private String direccion;
    private String ciudad;
    private Boolean activo;

    public static LocalDto from(Local local) {
        return LocalDto.builder()
                .id(local.getId())
                .nombre(local.getNombre())
                .direccion(local.getDireccion())
                .ciudad(local.getCiudad())
                .activo(local.getActivo())
                .build();
    }
}
