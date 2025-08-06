package com.idat.pe.PROYECTOS.controller;

import com.idat.pe.PROYECTOS.entity.Cafe;
import com.idat.pe.PROYECTOS.service.CafeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafes")
@CrossOrigin(origins = "*")
public class CafeController {

    @Autowired
    private CafeService cafeService;

    @GetMapping
    public ResponseEntity<List<Cafe>> listarCafes() {
        return ResponseEntity.ok(cafeService.listarTodos());
    }
}
