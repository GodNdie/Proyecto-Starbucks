package com.idat.pe.PROYECTOS.controller;

import com.idat.pe.PROYECTOS.entity.Personalizacion;
import com.idat.pe.PROYECTOS.service.PersonalizacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/personalizaciones")
@CrossOrigin(origins = "*")
public class PersonalizacionController {

    @Autowired
    private PersonalizacionService personalizacionService;

    @GetMapping
    public ResponseEntity<Map<String, List<Personalizacion>>> listarAgrupadoPorTipo() {
        List<Personalizacion> todas = personalizacionService.listar();

        Map<String, List<Personalizacion>> agrupado = todas.stream()
                .collect(Collectors.groupingBy(Personalizacion::getTipo));

        return ResponseEntity.ok(agrupado);
    }
}
