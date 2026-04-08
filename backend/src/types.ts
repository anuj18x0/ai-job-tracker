import type { Request } from 'express';
import type { IUser } from './models/User.js';

/**
 * Extend Express Request with the `user` field set by the `protect` middleware.
 * Using declaration merging so Express route handlers accept our typed request.
 */
declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export type AuthRequest = Request;
