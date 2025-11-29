import React, { useState, useEffect } from 'react';
import { register, login } from './service/authService';
import { addProduct, getProducts } from './service/productService';
import { addSale, getSales } from './service/salesService';
import PedidoForm from "./components/PedidoForm";
import PedidoList from "./components/PedidoList";
import './App.css';

function App() {
  // ------------------ ESTADOS ------------------
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [logged, setLogged] = useState(false);

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [saleQuantity, setSaleQuantity] = useState('');
  const [totalGanancia, setTotalGanancia] = useState(0);

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price_cost, setPriceCost] = useState('');
  const [price_sale, setPriceSale] = useState('');
  const [editId, setEditId] = useState(null);

  const [reloadPedidos, setReloadPedidos] = useState(false); // Para actualizar lista de pedidos

  // ------------------ EFFECTS ------------------
  useEffect(() => {
    if (logged) {
      fetchProducts();
      fetchSales();
    }
  }, [logged]);

  // ------------------ FUNCIONES ------------------
  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const fetchSales = async () => {
    const data = await getSales();
    setSales(data);

    const ganancia = data.reduce((total, s) => {
      const prod = products.find(p => p.id === s.product_id);
      if (!prod) return total;
      return total + ((prod.price_sale - prod.price_cost) * s.quantity);
    }, 0);
    setTotalGanancia(ganancia);
  };

  const handleRegister = async () => {
    if (!username || !password) return setMsg('Ingrese usuario y contraseña');
    const res = await register(username, password);
    setMsg(res.message);
  };

  const handleLogin = async () => {
    try {
      const data = await login(username, password); 
      if (data.message === "Login exitoso") {
        setLogged(true);
        setMsg(data.message);
      } else {
        setMsg(data.message);
      }
    } catch (err) {
      console.error('Error en login:', err.message);
      setMsg(err.message);
    }
  };

  const handleAddOrUpdateProduct = async () => {
    if (!name || !quantity || !price_cost || !price_sale) {
      return setMsg('Completa todos los campos');
    }

    if (editId) {
      const res = await fetch(`http://localhost:8080/api/product/update/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity, price_cost, price_sale })
      });
      const data = await res.json();
      setMsg(data.message);
      setEditId(null);
    } else {
      const res = await addProduct(name, quantity, 0, price_cost, price_sale);
      setMsg(res.message);
    }

    setName('');
    setQuantity('');
    setPriceCost('');
    setPriceSale('');
    fetchProducts();
  };

  const handleEditClick = (prod) => {
    setEditId(prod.id);
    setName(prod.name);
    setQuantity(prod.quantity);
    setPriceCost(prod.price_cost);
    setPriceSale(prod.price_sale);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/product/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setMsg(data.message);
      fetchProducts();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      setMsg("Error al eliminar producto");
    }
  };

  const handleAddSale = async () => {
    if (!selectedProduct || !saleQuantity) return setMsg('Selecciona producto y cantidad');
    const res = await addSale(selectedProduct, parseInt(saleQuantity));
    setMsg(res.message);
    setSelectedProduct('');
    setSaleQuantity('');
    fetchProducts();
    fetchSales();
  };

  const handleCloseCash = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/sales/close', { method: 'POST' });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Cierre_de_Caja.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error al generar cierre de caja:', error);
      setMsg('Error al generar cierre de caja');
    }
  };

  // ------------------ RENDER ------------------
  if (logged) {
    return (
      <div className="container">
        <h2>Menú Principal</h2>

        {/* --- AGREGAR / EDITAR PRODUCTO --- */}
        <h3>{editId ? 'Editar Producto' : 'Agregar Producto'}</h3>
        <div className="form-group">
          <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
          <input type="number" placeholder="Cantidad" value={quantity} onChange={e => setQuantity(e.target.value)} />
          <input type="number" placeholder="Precio Costo" value={price_cost} onChange={e => setPriceCost(e.target.value)} />
          <input type="number" placeholder="Precio Venta" value={price_sale} onChange={e => setPriceSale(e.target.value)} />
          <button onClick={handleAddOrUpdateProduct}>{editId ? 'Guardar Cambios' : 'Agregar'}</button>
          {editId && <button onClick={() => { setEditId(null); setName(''); setQuantity(''); setPriceCost(''); setPriceSale(''); }}>Cancelar</button>}
          <p className="msg">{msg}</p>
        </div>

        {/* --- REGISTRAR VENTA --- */}
        <h3>Registrar Venta</h3>
        <div className="form-group">
          <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
            <option value="">Selecciona un producto</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - Stock: {p.quantity} - Precio Venta: ${p.price_sale}
              </option>
            ))}
          </select>
          <input type="number" placeholder="Cantidad" value={saleQuantity} onChange={e => setSaleQuantity(e.target.value)} />
          <button onClick={handleAddSale}>Vender</button>
        </div>

        <p className="msg">Ganancia Total: ${totalGanancia.toFixed(2)}</p>

        {/* --- LISTA DE PRODUCTOS --- */}
        <h3>Lista de Productos</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio Costo</th>
              <th>Precio Venta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.name}</td>
                <td>{prod.quantity}</td>
                <td>{prod.price_cost}</td>
                <td>{prod.price_sale}</td>
                <td>
                  <button onClick={() => handleEditClick(prod)}>Editar</button>
                  <button onClick={() => handleDeleteProduct(prod.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- PEDIDOS --- */}
        <h3>Pedidos</h3>
        <PedidoForm onPedidoAgregado={() => setReloadPedidos(!reloadPedidos)} />
        <PedidoList key={reloadPedidos} />

        {/* --- BOTÓN CIERRE DE CAJA --- */}
        <button
          onClick={handleCloseCash}
          style={{
            marginTop: '20px',
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Cierre de Caja
        </button>
      </div>
    );
  }

  // ------------------ LOGIN / REGISTRO ------------------
  return (
    <div className="container">
      <h2>Registro y Login</h2>
      <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrar</button>
      <button onClick={handleLogin}>Login</button>
      <p>{msg}</p>
    </div>
  );
}

export default App;