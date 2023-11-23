import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateBookmark = [
  body('listingId').isNumeric().withMessage('Listing ID must be a number'),
  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    next();
  },
];
