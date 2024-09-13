import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import blogRoutes from './routes/blogRoutes.js';

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// For dev purposes, enable all origins & avoid cors errors
app.use(cors());
// Middleware to parse incoming requests with JSON
app.use(express.json());

// Define routes (handled in routes folder to keep modular)
app.use('/api/blogs', blogRoutes);

// Start up the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));