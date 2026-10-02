import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

export async function isLoggedIn(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return res.status(401).json({
        message: 'Sign in to continue.',
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'development-only-secret'
    );

    const user = await User.findById(payload.sub).select(
      '_id name email'
    );

    if (!user) {
      return res.status(401).json({
        message: 'Your session is no longer valid.',
      });
    }

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      message: 'Your session is invalid or has expired.',
    });
  }
}