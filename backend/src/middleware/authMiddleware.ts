import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};
