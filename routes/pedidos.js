const express = require('express');
const router = express.Router();
const { addPedido, getPedidos, updateEstado } = require('../controller/pedidosController');

// Crear pedido
router.post('/add', addPedido);

// Obtener todos los pedidos
router.get('/list', getPedidos);

// Actualizar estado
router.put('/update/:id', updateEstado);

module.exports = router;