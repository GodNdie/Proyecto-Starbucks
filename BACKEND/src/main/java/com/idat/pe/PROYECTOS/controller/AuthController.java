package com.idat.pe.PROYECTOS.controller;

import com.idat.pe.PROYECTOS.dto.LoginRequest;
import com.idat.pe.PROYECTOS.dto.LoginResponse;
import com.idat.pe.PROYECTOS.dto.MensajeResponse;
import com.idat.pe.PROYECTOS.dto.RegistroRequest;
import com.idat.pe.PROYECTOS.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registro")
    public ResponseEntity<MensajeResponse> registrarUsuario(@Valid @RequestBody RegistroRequest request) {
        usuarioService.registrar(request);
        return ResponseEntity.ok(new MensajeResponse("Usuario registrado correctamente"));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = usuarioService.login(request);
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @GetMapping("/protegido")
    public ResponseEntity<MensajeResponse> rutaProtegida() {
        return ResponseEntity.ok(new MensajeResponse("¡Acceso permitido con token JWT!"));
    }
}

