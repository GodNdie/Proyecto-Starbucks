package com.idat.pe.PROYECTOS.service;

import com.idat.pe.PROYECTOS.entity.Personalizacion;
import com.idat.pe.PROYECTOS.repository.PersonalizacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonalizacionService {

    @Autowired
    private PersonalizacionRepository personalizacionRepository;

    public List<Personalizacion> listar() {
        return personalizacionRepository.findAll();
    }
}
