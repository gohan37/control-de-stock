const API_URL = 'http://localhost:8080/api/product';

// Crear producto
export async function addProduct(name, quantity, price, price_cost, price_sale) {
  const res = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, quantity, price, price_cost, price_sale })
  });
  return res.json();
}

// Listar productos
export async function getProducts() {
  const res = await fetch(`${API_URL}/list`);
  return res.json();
}