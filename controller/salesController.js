const pool = require('../config/db');
const ExcelJS = require('exceljs');

// Registrar una venta
const addSale = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [product_id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });

    const product = rows[0];
    if (product.quantity < quantity) return res.status(400).json({ message: 'Stock insuficiente' });

    const total = product.price_sale * quantity;

    await pool.query(
      'INSERT INTO sales (product_id, quantity, total) VALUES (?, ?, ?)',
      [product_id, quantity, total]
    );

    await pool.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [quantity, product_id]);

    res.status(201).json({
      message: 'Venta registrada',
      total,
      price_cost: product.price_cost,
      price_sale: product.price_sale
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar venta', error });
  }
};

// Obtener todas las ventas
const getSales = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.product_id, p.name, s.quantity, p.price_cost, p.price_sale, s.total, s.sale_date
      FROM sales s
      JOIN products p ON s.product_id = p.id
      ORDER BY s.sale_date DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error });
  }
};

// Cierre de caja
const closeCashStyled = async (req, res) => {
  try {
    const [sales] = await pool.query(`
      SELECT s.id, s.product_id, p.name, s.quantity, p.price_cost, p.price_sale, s.total, p.quantity as stock
      FROM sales s
      JOIN products p ON s.product_id = p.id
      ORDER BY s.sale_date DESC
    `);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Cierre de Caja');

    // Definir columnas
    sheet.columns = [
      { header: 'ID Venta', key: 'id', width: 10 },
      { header: 'Producto', key: 'name', width: 25 },
      { header: 'Cantidad Vendida', key: 'quantity', width: 15 },
      { header: 'Precio Costo', key: 'price_cost', width: 15 },
      { header: 'Precio Venta', key: 'price_sale', width: 15 },
      { header: 'Ganancia', key: 'ganancia', width: 15 },
      { header: 'Stock Restante', key: 'stock', width: 15 }
    ];

    // Estilo de header
    sheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'FF1F4E78'} };
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      };
    });

    // Agregar filas de ventas con estilo alternado
    sales.forEach((s, index) => {
      const row = sheet.addRow({
        id: s.id,
        name: s.name,
        quantity: s.quantity,
        price_cost: s.price_cost,
        price_sale: s.price_sale,
        ganancia: (s.price_sale - s.price_cost) * s.quantity,
        stock: s.stock
      });

      // Colores alternados
      const fillColor = index % 2 === 0 ? 'FFEFEFEF' : 'FFFFFFFF';
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern:'solid', fgColor:{argb:fillColor} };
        cell.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        };
      });

      // Formato moneda
      row.getCell('price_cost').numFmt = '$#,##0.00';
      row.getCell('price_sale').numFmt = '$#,##0.00';
      row.getCell('ganancia').numFmt = '$#,##0.00';
    });

    // Ganancia total
    const totalGanancia = sales.reduce((acc, s) => acc + ((s.price_sale - s.price_cost) * s.quantity), 0);

    // Fila vacía
    sheet.addRow({});

    // Fila total
    const totalRow = sheet.addRow({
      id: '',
      name: 'Ganancia Total',
      quantity: '',
      price_cost: '',
      price_sale: '',
      ganancia: totalGanancia,
      stock: ''
    });
    totalRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'FFFFD700'} }; // Dorado
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      };
      if(cell._column.key === 'ganancia') cell.numFmt = '$#,##0.00';
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Cierre_de_Caja_Styled.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar cierre de caja', error });
  }
};

module.exports = {
  closeCashStyled
};

// Exportamos como CommonJS
module.exports = {
  addSale,
  getSales,
   closeCashStyled
};