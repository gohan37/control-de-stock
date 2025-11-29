const API_URL = 'http://localhost:8080/api/sales';

// Obtener todas las ventas
export async function getSales() {
  const res = await fetch(`${API_URL}/list`);
  return res.json();
}

// Registrar una venta
export async function addSale(product_id, quantity) {
  const res = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id, quantity })
  });
  return res.json();
}

// Cierre de caja (genera Excel)
export async function closeCash() {
  const res = await fetch(`${API_URL}/close`, {
    method: 'POST'
  });
  return res; // devolvemos el blob directamente para descargar
}