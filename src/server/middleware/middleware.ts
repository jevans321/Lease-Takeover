import jwt, { VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { CustomJwtPayload, CustomRequest } from '../utility/customTypes';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null, payload) => {
    if (err) {
      // Log the error for internal diagnostics
      const errorMessage = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
      return res.status(403).json({ error: errorMessage });
    }
    if (!payload) {
      return res.status(403).json({ error: 'Invalid token payload' });
    }
    // add user payload to request
    (req as CustomRequest).token = payload as CustomJwtPayload;
    next();
  });
};

export {
  authenticateJWT,
};