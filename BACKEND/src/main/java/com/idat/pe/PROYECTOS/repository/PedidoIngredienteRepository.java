package com.idat.pe.PROYECTOS.repository;

import com.idat.pe.PROYECTOS.entity.Pedido;
import com.idat.pe.PROYECTOS.entity.PedidoIngrediente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoIngredienteRepository extends JpaRepository<PedidoIngrediente, Void> {
    List<PedidoIngrediente> findByPedido(Pedido pedido);
}
