import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import validator from 'validator';

export const validateListing = [
  body('title').optional().isLength({ min: 1 }).withMessage('Title cannot be empty'),
  body('description').optional().isLength({ min: 1 }).withMessage('Description cannot be empty'),
  body('city').not().isEmpty().withMessage('City is required'),
  body('state').not().isEmpty().withMessage('State is required'),
  body('zipCode').not().isEmpty().withMessage('Zip Code is required'),
  body('rent').isNumeric().withMessage('Rent must be a number'),
  body('leaseStart').isISO8601().withMessage('Invalid lease start date'),
  body('leaseEnd').isISO8601().optional().withMessage('Invalid lease end date'),
  body('leaseType').optional().isLength({ min: 1 }).withMessage('Lease type cannot be empty'),
  body('propertyType').optional().isLength({ min: 1 }).withMessage('Property type cannot be empty'),
  body('bedrooms').isNumeric().withMessage('Number of bedrooms must be a number'),
  body('bathrooms').isNumeric().withMessage('Number of bathrooms must be a number'),
  body('furnished').isBoolean().withMessage('Furnished must be true or false'),
  body('petFriendly').isBoolean().withMessage('Pet Friendly must be true or false'),
  body('utilitiesIncluded').isBoolean().withMessage('Utilities Included must be true or false'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
  body('imageUrl').optional().isURL().withMessage('Image URL must be valid'),

  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateSearchParameters = [
  (request: Request, response: Response, next: NextFunction) => {
    let { city, zipcode } = request.query;

    // Regular Expressions for Format Validation
    const cityRegex = /^[a-zA-Z\s\-]+$/;
    const zipcodeRegex = /^\d{5}$/;

    // Check and sanitize 'city'
    if (city !== undefined) {
      city = typeof city === 'string' ? city.trim() : '';
      if (!cityRegex.test(city) || city.length > 50) { // Length check
        return response.status(400).json({ message: 'Invalid city parameter' });
      }
      city = validator.escape(city).toLowerCase(); // Sanitization and case normalization
    }

    // Check and sanitize 'zipcode'
    if (zipcode !== undefined) {
      zipcode = typeof zipcode === 'string' ? zipcode.trim() : '';
      if (!zipcodeRegex.test(zipcode)) {
        return response.status(400).json({ message: 'Invalid zipcode parameter' });
      }
      zipcode = validator.escape(zipcode);
    }

    // Attach sanitized values to the request for further processing
    request.query.city = city;
    request.query.zipcode = zipcode;

    next();
  }
];



