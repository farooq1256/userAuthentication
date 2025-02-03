
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth/auth-routes.js';
import todoRoutes from './routes/todos/todo-routes.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import createHttpError from "http-errors";

dotenv.config();

const app = express();


// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Sample route
app.get("/", (req, res, next) => {
    res.json({ message: "Welcome to todo project" });
});


// Enable CORS with specific configurations
app.use(
    cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
    methods: ['GET','POST','DELETE','PUT'],
    allowedHeaders : [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma"
    ]
}));


// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use(globalErrorHandler)


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
    }
  });
  