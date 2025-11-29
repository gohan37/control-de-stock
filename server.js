require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const salesRoutes = require('./routes/sales');
const pedidosRoutes = require('./routes/pedidos');
const app = express();
const PORT = 8080;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// prueba simple
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/sales', salesRoutes);
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
app.use('/api/pedidos', pedidosRoutes);
