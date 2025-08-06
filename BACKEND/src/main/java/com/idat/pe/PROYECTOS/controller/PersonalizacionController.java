package com.idat.pe.PROYECTOS.controller;

import com.idat.pe.PROYECTOS.entity.Personalizacion;
import com.idat.pe.PROYECTOS.service.PersonalizacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personalizaciones")
@CrossOrigin(origins = "*")
public class PersonalizacionController {

    @Autowired
    private PersonalizacionService personalizacionService;

    @GetMapping
    public ResponseEntity<List<Personalizacion>> listarPersonalizaciones() {
        return ResponseEntity.ok(personalizacionService.listar());
    }
}
