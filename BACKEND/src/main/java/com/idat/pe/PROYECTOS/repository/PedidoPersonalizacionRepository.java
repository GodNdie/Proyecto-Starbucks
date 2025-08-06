package com.idat.pe.PROYECTOS.repository;

import com.idat.pe.PROYECTOS.entity.Pedido;
import com.idat.pe.PROYECTOS.entity.PedidoPersonalizacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoPersonalizacionRepository extends JpaRepository<PedidoPersonalizacion, Void> {
    List<PedidoPersonalizacion> findByPedido(Pedido pedido);
}
