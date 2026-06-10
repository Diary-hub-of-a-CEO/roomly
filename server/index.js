import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { initDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 4000;
const dbPath = path.join(__dirname, 'rooms.db');

app.use(cors());
app.use(express.json());

const db = await open({
  filename: dbPath,
  driver: sqlite3.Database
});

await initDb(db);

app.get('/api/rooms', async (req, res) => {
  const rows = await db.all('SELECT * FROM rooms ORDER BY price ASC');
  const rooms = rows.map((row) => ({
    ...row,
    universities: JSON.parse(row.universities),
    facilities: JSON.parse(row.facilities),
    petsAllowed: Boolean(row.petsAllowed)
  }));
  res.json(rooms);
});

app.get('/api/rooms/:id', async (req, res) => {
  const row = await db.get('SELECT * FROM rooms WHERE id = ?', req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json({
    ...row,
    universities: JSON.parse(row.universities),
    facilities: JSON.parse(row.facilities),
    petsAllowed: Boolean(row.petsAllowed)
  });
});

app.post('/api/estimate', async (req, res) => {
  const { location, roomType, noiseLevel, petsAllowed, furnished, bathrooms, proximityScore } = req.body;
  const baseMap = {
    'Single Bed': 550,
    'Double Bed': 820,
    'Office Space': 1240,
    'Studio Apartment': 980
  };
  const locationBoost = /downtown|central|city|prime/i.test(location) ? 1.28 : /near university|campus|station/i.test(location) ? 1.16 : 1.04;
  const typeBase = baseMap[roomType] ?? 700;
  const noiseFactor = noiseLevel === 'Low' ? 0.94 : noiseLevel === 'High' ? 1.08 : 1.0;
  const petsFactor = petsAllowed ? 1.06 : 0.96;
  const furnishBonus = furnished ? 120 : 0;
  const bathroomBoost = 35 * Math.max(0, bathrooms - 1);
  const proximityBoost = 1 + (Math.min(10, Math.max(1, proximityScore)) - 5) * 0.03;

  const estimatedRent = Math.round((typeBase + furnishBonus + bathroomBoost) * locationBoost * noiseFactor * petsFactor * proximityBoost);
  const explanation = `Estimated rent for a ${roomType.toLowerCase()} near ${location} is calculated from location, available facilities, noise comfort and pets policy.`;

  res.json({ estimatedRent, explanation });
});

const publicPath = path.join(__dirname, '..', 'dist');
app.use(express.static(publicPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Roomly backend listening on http://localhost:${port}`);
});
