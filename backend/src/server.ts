import express, { type Request, type Response, type NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { Redis } from '@upstash/redis';
import multer from 'multer';

// Route files
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

// Load env vars
dotenv.config();

// Redis Client wrapper for connect-redis compatibility
const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const redisStoreClient = {
  get: (key: string) => redisClient.get<string>(key),
  set: (key: string, value: string, options?: { EX?: number }) => {
    if (options?.EX) {
      return redisClient.set(key, value, { ex: options.EX });
    }
    return redisClient.set(key, value);
  },
  del: (key: string | string[]) => 
    Array.isArray(key) ? redisClient.del(...key) : redisClient.del(key),
};

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Session configuration with Redis
app.use(
  session({
    store: new RedisStore({ client: redisStoreClient as any }),
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    },
  })
);

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);
// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);

  // Multer error handling
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large. Max limit is 4MB.' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
