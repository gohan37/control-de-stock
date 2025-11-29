const pool = require('../config/db');

// Crear un pedido
const addPedido = async (req, res) => {
  try {
    const { cliente_nombre, cliente_telefono, productos, direccion, lat, lng, metodo_pago, notas } = req.body;

    await pool.query(
      'INSERT INTO pedidos (cliente_nombre, cliente_telefono, productos, direccion, lat, lng, metodo_pago, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [cliente_nombre, cliente_telefono, JSON.stringify(productos), direccion, lat, lng, metodo_pago, notas]
    );

    res.status(201).json({ message: 'Pedido registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear pedido', error });
  }
};

// Obtener todos los pedidos
const getPedidos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pedidos ORDER BY fecha DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener pedidos', error });
  }
};

// Actualizar estado de un pedido
const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await pool.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
    res.status(200).json({ message: 'Estado actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar estado', error });
  }
};

module.exports = {
  addPedido,
  getPedidos,
  updateEstado
};