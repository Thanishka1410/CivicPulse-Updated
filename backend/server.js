import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Router
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', name: 'CivicPulse API Backend', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 CivicPulse Express Backend server listening on port ${PORT}`);
});
