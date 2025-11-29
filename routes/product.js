const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

// Crear producto
router.post('/add', productController.createProduct);

// Listar productos
router.get('/list', productController.getProducts);

// Editar producto
router.put('/update/:id', productController.updateProduct);

// Eliminar producto
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;