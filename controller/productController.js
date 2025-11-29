const pool = require('../config/db');

// Crear producto
const createProduct = async (req, res) => {
  try {
    const { name, quantity, price, price_cost, price_sale } = req.body;
    const [result] = await pool.query(
      "INSERT INTO products (name, quantity, price, price_cost, price_sale) VALUES (?, ?, ?, ?, ?)",
      [name, quantity, price, price_cost, price_sale]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      quantity,
      price,
      price_cost,
      price_sale
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando producto", error });
  }
};

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, price_cost, price_sale } = req.body;

    const [result] = await pool.query(
      `UPDATE products 
       SET name = ?, quantity = ?, price_cost = ?, price_sale = ? 
       WHERE id = ?`,
      [name, quantity, price_cost, price_sale, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando producto', error });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Primero borramos las ventas de ese producto
    await pool.query("DELETE FROM sales WHERE product_id = ?", [id]);

    // Luego borramos el producto
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
};