
import React, { useState, useEffect } from 'react';

export default function PedidoForm({ onPedidoAgregado }) {
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [productos, setProductos] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cliente || !telefono || !direccion || !productos) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const pedido = {
  cliente_nombre: cliente,
  cliente_telefono: telefono,
  direccion,
  productos,
  metodo_pago: metodoPago,
  lat: null,
  lng: null,
  notas: null
};

    try {
      const res = await fetch("http://localhost:8080/api/pedidos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Pedido registrado!");
        onPedidoAgregado(); // para actualizar lista
        setCliente("");
        setTelefono("");
        setDireccion("");
        setProductos("");
        setMetodoPago("Efectivo");
      } else {
        alert(data.message || "Error al registrar pedido");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectarse al servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Nombre del Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <input
        type="text"
        placeholder="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />
      <input
        type="text"
        placeholder="Productos"
        value={productos}
        onChange={(e) => setProductos(e.target.value)}
      />
      <select
        value={metodoPago}
        onChange={(e) => setMetodoPago(e.target.value)}
      >
        <option value="Efectivo">Efectivo</option>
        <option value="Tarjeta">Tarjeta</option>
      </select>
      <button type="submit">Registrar Pedido</button>
    </form>
  );
}
