import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('IronsIDE eBay Market Data Engine - ONLINE');
});

// Placeholder for the actual market data endpoint
app.get('/comps', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required.' });
  }
  // TODO: Implement the eBay fetch logic here
  res.json({ query, value: 0, status: 'pending_implementation' });
});

app.listen(port, () => {
  console.log(`[server]: Market Data Engine is running at http://localhost:${port}`);
});