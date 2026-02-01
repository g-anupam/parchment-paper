import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Route imports
import userRouter from './routes/user.routes.js';
import noteRouter from './routes/note.routes.js';

const app = express();

// --- 1. MIDDLEWARES ---

/**
 * CORS - Cross-Origin Resource Sharing
 * Essential for your React frontend to talk to this backend.
 */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Frontend URL
    credentials: true, // Required for sending/receiving cookies
  })
);

/**
 * Request Parsing
 * 'limit' prevents users from sending massive JSON payloads that could crash the server.
 */
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

/**
 * Cookie Parser
 * Essential for our auth.middleware to read the accessToken from the browser.
 */
app.use(cookieParser());

/**
 * Static Files
 * Allows serving temporary images from the public/temp folder if needed.
 */
app.use(express.static('public'));

// --- 2. ROUTES ---

// Health check (stolen from your past project—it's a great habit!)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// Primary API Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notes', noteRouter);

// --- 3. ERROR HANDLING ---

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

export { app };
