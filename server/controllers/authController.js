import bcrypt from 'bcryptjs';
import User from '../models/userSchema.js';
import { generateToken } from '../utils/generateToken.js';

export async function signupUser(req, res, next) {
  try {
    const { name, email, password } = req.body || {};

    if (typeof name !== 'string' ||name.trim().length < 2 ||name.trim().length > 60) {
      return res.status(400).json({
        message: 'Name must be between 2 and 60 characters.',
      });
    }

    if (typeof email !== 'string' ||!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        message: 'Enter a valid email address.',
      });
    }

    if (typeof password !== 'string' ||password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters.',
      });
    }

    if (await User.exists({ email: email.toLowerCase().trim() })) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: await bcrypt.hash(password, 12),
    });

    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    next(error);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (
      !user ||
      !await bcrypt.compare(password, user.password)
    ) {
      return res.status(401).json({
        message: 'Email or password is incorrect.',
      });
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

export function getCurrentUser(req, res) {
  res.json({ user: req.user });
}