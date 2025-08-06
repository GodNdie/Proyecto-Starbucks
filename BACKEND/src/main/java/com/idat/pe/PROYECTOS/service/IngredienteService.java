package com.idat.pe.PROYECTOS.service;

import com.idat.pe.PROYECTOS.entity.Ingrediente;
import com.idat.pe.PROYECTOS.repository.IngredienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredienteService {

    @Autowired
    private IngredienteRepository ingredienteRepository;

    public List<Ingrediente> listar() {
        return ingredienteRepository.findAll();
    }
}
