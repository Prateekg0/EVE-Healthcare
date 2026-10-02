import express from 'express';
import cors from 'cors';
import path from 'node:path';

import usersRouter from './server/routes/usersRouter.js';
import centresRouter from './server/routes/centresRouter.js';
import bookingsRouter from './server/routes/bookingsRouter.js';
import paymentsRouter from './server/routes/paymentsRouter.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);

app.use(express.json({ limit: '20kb' }));

// Health Check
app.get('/api/health', (_req, res) =>
  res.json({
    status: 'ok',
    service: 'eve-healthcare-api',
  })
);

// API Routes
app.use('/api/auth', usersRouter);
app.use('/api/centres', centresRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);

// Keep the assignment's provider-facing paths available without the /api prefix too.
app.use('/payments', paymentsRouter);

// Serve Static Files
app.use(express.static(path.resolve('dist')));

// Frontend Route
app.get('*', (req, res, next) =>
  req.path.startsWith('/api/')
    ? next()
    : res.sendFile(path.resolve('dist/index.html'), (error) =>
      error && next(error)
    )
);

// 404 Error Handler
app.use((req, res) =>
  res.status(404).json({
    message: `Route ${req.method} ${req.path} was not found.`,
  })
);

// Global Error Handler
app.use((error, _req, res, _next) => {
  if (!error.status || error.status >= 500) {
    console.error(error);
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: error.message,
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid resource ID.',
    });
  }

  res.status(error.status || 500).json({
    message: error.status
      ? error.message
      : 'Something went wrong.',
  });
});

export default app;