import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRegisterUser = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('password').matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
  body('password').matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter'),
  body('password').matches(/[0-9]/).withMessage('Password must contain at least one number'),
  body('password').matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
  body('userType').isIn(['Lister', 'Leasee']).withMessage('Invalid user type'),
  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

export const validateLoginUser = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('password').matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
  body('password').matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter'),
  body('password').matches(/[0-9]/).withMessage('Password must contain at least one number'),
  body('password').matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    next();
  },
];
