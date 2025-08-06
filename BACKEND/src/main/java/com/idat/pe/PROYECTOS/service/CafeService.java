package com.idat.pe.PROYECTOS.service;

import com.idat.pe.PROYECTOS.entity.Cafe;
import com.idat.pe.PROYECTOS.repository.CafeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CafeService {

    @Autowired
    private CafeRepository cafeRepository;

    public List<Cafe> listarTodos() {
        List<Cafe> cafes = cafeRepository.findAll();
        System.out.println("CAFÉS ENCONTRADOS: " + cafes.size());
        return cafes;
    }
}
