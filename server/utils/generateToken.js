import jwt from 'jsonwebtoken';

export function generateToken(user) {
  return jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET || 'development-only-secret',
    { expiresIn: '7d' },
  );
}
