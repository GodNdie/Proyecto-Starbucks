package com.idat.pe.PROYECTOS.controller;

import com.idat.pe.PROYECTOS.entity.Ingrediente;
import com.idat.pe.PROYECTOS.service.IngredienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredientes")
@CrossOrigin(origins = "*")
public class IngredienteController {

    @Autowired
    private IngredienteService ingredienteService;

    @GetMapping
    public ResponseEntity<List<Ingrediente>> listarIngredientes() {
        return ResponseEntity.ok(ingredienteService.listar());
    }
}
