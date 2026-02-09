// BPESE Inventory System - Backend Server
// Node.js + Express + PostgreSQL

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

// ============= API ENDPOINTS =============

// Get all components
app.get('/api/components', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM components ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add component
app.post('/api/components', async (req, res) => {
  const { category, description, value, size, voltage, watt, type, partNo, rack, location, quantity, minStock, image } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO components (category, description, value, size, voltage, watt, type, partNo, rack, location, quantity, minStock, image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [category, description, value, size, voltage, watt, type, partNo, rack, location, quantity, minStock, image]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update component
app.put('/api/components/:id', async (req, res) => {
  const { id } = req.params;
  const { category, description, value, size, voltage, watt, type, partNo, rack, location, quantity, minStock, image } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE components SET category=$1, description=$2, value=$3, size=$4, voltage=$5, watt=$6, 
       type=$7, partNo=$8, rack=$9, location=$10, quantity=$11, minStock=$12, image=$13 
       WHERE id=$14 RETURNING *`,
      [category, description, value, size, voltage, watt, type, partNo, rack, location, quantity, minStock, image, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete component
app.delete('/api/components/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query('DELETE FROM components WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update component quantity only
app.patch('/api/components/:id/quantity', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE components SET quantity=$1 WHERE id=$2 RETURNING *',
      [quantity, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add transaction
app.post('/api/transactions', async (req, res) => {
  const { date, type, status, componentName, quantity, user, remarks } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO transactions (date, type, status, componentName, quantity, "user", remarks) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [date, type, status, componentName, quantity, user, remarks]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all borrowed components
app.get('/api/borrowed', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM borrowed_components ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add borrowed component
app.post('/api/borrowed', async (req, res) => {
  const { componentId, componentName, partNo, category, borrowedQty, returnedQty, consumedQty, scrappedQty, user, date, purpose, image } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO borrowed_components (componentId, componentName, partNo, category, borrowedQty, returnedQty, consumedQty, scrappedQty, "user", date, purpose, image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [componentId, componentName, partNo, category, borrowedQty, returnedQty, consumedQty, scrappedQty, user, date, purpose, image]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update borrowed component
app.put('/api/borrowed/:id', async (req, res) => {
  const { id } = req.params;
  const { componentId, componentName, partNo, category, borrowedQty, returnedQty, consumedQty, scrappedQty, user, date, purpose, image } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE borrowed_components SET componentId=$1, componentName=$2, partNo=$3, category=$4, 
       borrowedQty=$5, returnedQty=$6, consumedQty=$7, scrappedQty=$8, "user"=$9, date=$10, purpose=$11, image=$12 
       WHERE id=$13 RETURNING *`,
      [componentId, componentName, partNo, category, borrowedQty, returnedQty, consumedQty, scrappedQty, user, date, purpose, image, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY username ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add user
app.post('/api/users', async (req, res) => {
  const { username, password, role } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, password, role]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update user password
app.put('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  const { password } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE users SET password=$1 WHERE username=$2 RETURNING *',
      [password, username]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete user
app.delete('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    await pool.query('DELETE FROM users WHERE username=$1', [username]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
