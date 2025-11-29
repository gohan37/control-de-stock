const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // o tu usuario
  password: 'siemprepadelante',
  database: 'stock_control'
});

module.exports = pool;