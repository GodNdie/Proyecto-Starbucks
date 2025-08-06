package com.idat.pe.PROYECTOS.service;

import com.idat.pe.PROYECTOS.dto.LoginRequest;
import com.idat.pe.PROYECTOS.dto.RegistroRequest;
import com.idat.pe.PROYECTOS.dto.UsuarioPerfilUpdateRequest;
import com.idat.pe.PROYECTOS.entity.Usuario;
import com.idat.pe.PROYECTOS.repository.UsuarioRepository;
import com.idat.pe.PROYECTOS.security.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtil jwtUtil;

    public void registrar(RegistroRequest request) {
        // Verificar si el correo ya está registrado
        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario nuevo = new Usuario();
        nuevo.setNombre(request.getNombre());
        nuevo.setApellido(request.getApellido());
        nuevo.setCorreo(request.getCorreo());
        nuevo.setDni(request.getDni());
        nuevo.setTelefono(request.getTelefono());
        nuevo.setContrasenaHash(passwordEncoder.encode(request.getContrasena()));

        usuarioRepository.save(nuevo);
    }

    public String login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasenaHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return jwtUtil.generateToken(usuario.getCorreo());
    }

    public Usuario obtenerPerfil(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    public void actualizarPerfil(String correo, UsuarioPerfilUpdateRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setTelefono(request.getTelefono());

        usuarioRepository.save(usuario);
    }

}
