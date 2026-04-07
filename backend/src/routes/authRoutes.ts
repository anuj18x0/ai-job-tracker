import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.get('/verify-email/:token', verifyEmail);

export default router;
