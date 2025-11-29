const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Verifica si el usuario ya existe
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) return res.status(400).json({ message: 'Usuario ya existe' });

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserta el usuario
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Busca el usuario
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' });

    const user = rows[0];
    // Compara la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Contraseña incorrecta' });

    res.status(200).json({ message: 'Login exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error });
  }
};