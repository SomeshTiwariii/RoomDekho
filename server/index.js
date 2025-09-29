import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoute } from './routes/userRoute.js';
import { residenceRoute } from './routes/residencyRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Mount user routes at /api/user
app.use('/api/user', userRoute);
app.use('/api/residency',residenceRoute);

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
