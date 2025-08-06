package com.idat.pe.PROYECTOS.controller;

import com.idat.pe.PROYECTOS.dto.MensajeResponse;
import com.idat.pe.PROYECTOS.dto.UsuarioPerfilResponse;
import com.idat.pe.PROYECTOS.dto.UsuarioPerfilUpdateRequest;
import com.idat.pe.PROYECTOS.entity.Usuario;
import com.idat.pe.PROYECTOS.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioPerfilResponse> obtenerPerfil() {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioService.obtenerPerfil(correo);

        UsuarioPerfilResponse response = new UsuarioPerfilResponse();
        response.setNombre(usuario.getNombre());
        response.setApellido(usuario.getApellido());
        response.setCorreo(usuario.getCorreo());
        response.setDni(usuario.getDni());
        response.setTelefono(usuario.getTelefono());
        response.setFechaRegistro(usuario.getFecharegistro());

        return ResponseEntity.ok(response);
    }
    @PutMapping("/perfil")
    public ResponseEntity<MensajeResponse> actualizarPerfil(@Valid @RequestBody UsuarioPerfilUpdateRequest request) {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        usuarioService.actualizarPerfil(correo, request);
        return ResponseEntity.ok(new MensajeResponse("Perfil actualizado correctamente"));
    }

}
