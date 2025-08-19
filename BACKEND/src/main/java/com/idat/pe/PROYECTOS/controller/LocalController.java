package com.idat.pe.PROYECTOS.controller;


import com.idat.pe.PROYECTOS.dto.LocalDto;
import com.idat.pe.PROYECTOS.entity.Local;
import com.idat.pe.PROYECTOS.service.LocalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LocalController {

    private final LocalService service;

    @GetMapping
    public List<LocalDto> listar(
            @RequestParam(required = false) Boolean activo,
            @RequestParam(required = false) String ciudad
    ) {
        return service.listar(activo, ciudad);
    }
}
