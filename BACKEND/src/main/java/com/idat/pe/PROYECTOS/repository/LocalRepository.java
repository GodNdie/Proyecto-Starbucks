package com.idat.pe.PROYECTOS.repository;

import com.idat.pe.PROYECTOS.entity.Local;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocalRepository extends JpaRepository<Local, Long> {
    List<Local> findByActivoTrue();
    List<Local> findByActivo(Boolean activo);
    List<Local> findByActivoTrueAndCiudadContainingIgnoreCase(String ciudad);
}
