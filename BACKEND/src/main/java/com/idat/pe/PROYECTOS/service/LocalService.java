package com.idat.pe.PROYECTOS.service;


import com.idat.pe.PROYECTOS.dto.LocalDto;
import com.idat.pe.PROYECTOS.entity.Local;
import com.idat.pe.PROYECTOS.repository.LocalRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocalService {

    private final LocalRepository repo;

    public List<LocalDto> listar(Boolean activo, String ciudad) {
        List<Local> locales;
        if (Boolean.TRUE.equals(activo) && ciudad != null && !ciudad.isBlank()) {
            locales = repo.findByActivoTrueAndCiudadContainingIgnoreCase(ciudad);
        } else if (Boolean.TRUE.equals(activo)) {
            locales = repo.findByActivoTrue();
        } else if (activo != null) {
            locales = repo.findByActivo(activo);
        } else {
            locales = repo.findAll();
        }
        return locales.stream().map(LocalDto::from).toList();
    }

    @Transactional
    public LocalDto cambiarEstado(Long id, boolean activo) {
        Local local = repo.findById(id).orElseThrow(() -> new RuntimeException("Local no encontrado"));
        local.setActivo(activo);
        return LocalDto.from(repo.save(local));
    }
}
