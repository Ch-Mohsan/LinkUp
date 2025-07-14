require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test routes
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running' });
});

app.get('/test/:id', (req, res) => {
  res.json({ message: 'Test route works', id: req.params.id });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
}); 