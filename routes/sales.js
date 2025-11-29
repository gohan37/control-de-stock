const express = require('express');
const router = express.Router();
const salesController = require('../controller/salesController');

// Registrar venta
router.post('/add', salesController.addSale);

// Listar ventas
router.get('/list', salesController.getSales);

// Cierre de caja
router.post('/close', salesController.closeCashStyled);

module.exports = router;