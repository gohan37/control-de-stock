import React, { useState, useEffect } from 'react';

export default function PedidoList() {
  const [pedidos, setPedidos] = useState([]);

  const fetchPedidos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/pedidos/list");
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:8080/api/pedidos/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (res.ok) fetchPedidos();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <table border="1" cellPadding="5">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Productos</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.cliente_nombre}</td>
            <td>{p.productos}</td>
            <td>{p.estado}</td>
            <td>
              {p.estado !== "Entregado" && (
                <button onClick={() => actualizarEstado(p.id, "Entregado")}>
                  Marcar Entregado
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}