const express = require('express');
const cors = require('cors');
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/api/notes', async (req, res) => {
  const result = await pool.query('SELECT id, text, created_at FROM notes ORDER BY id DESC');
  res.json(result.rows);
});

app.post('/api/notes', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  const result = await pool.query(
    'INSERT INTO notes (text) VALUES ($1) RETURNING id, text, created_at',
    [text.trim()]
  );
  res.status(201).json(result.rows[0]);
});

if (require.main === module) {
  initDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to initialize database', err);
      process.exit(1);
    });
}

module.exports = app;
