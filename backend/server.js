const express = require('express');
const cors = require('cors');
const data = require('./data.json');

const app = express();
app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('SellerGrid Backend Running. Use /reviews or /stats');
});

// API routes
app.get('/reviews', (req, res) => res.json(data));
app.get('/stats', (req, res) => {
  const total = data.length;
  const positive = data.filter(r => r.sentiment === 'positive').length;
  const negative = data.filter(r => r.sentiment === 'negative').length;
  const platforms = [...new Set(data.map(r => r.platform))];
  res.json({ total, positive, negative, platforms });
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));