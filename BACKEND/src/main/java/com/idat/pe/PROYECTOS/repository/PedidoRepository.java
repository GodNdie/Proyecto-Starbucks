package com.idat.pe.PROYECTOS.repository;

import com.idat.pe.PROYECTOS.entity.Pedido;
import com.idat.pe.PROYECTOS.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuario(Usuario usuario);
}
