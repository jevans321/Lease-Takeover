import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateListing = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('description').not().isEmpty().withMessage('Description is required'),
  body('location').not().isEmpty().withMessage('Location is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    next();
  },
];
