import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { validateListing, validateSearchParameters } from '../listingValidator';

// Mock validationResult from express-validator
jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn(),
}));

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  return res;
};

const nextFunction = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (validationResult as any).mockReset();
});

describe('Tests for validateListing middleware', () => {
  const mockRequest = (bodyData = {}) => ({
    body: bodyData
  }) as unknown as Request;

  const lastIdx = validateListing.length - 1;

  it('should pass validation with valid listing data', () => {
    const req = mockRequest({ /* valid listing data */ });
    const res = mockResponse();
    (validationResult as any).mockImplementation(() => ({
      isEmpty: () => true
    }));
    validateListing[lastIdx](req, res, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 400 if required fields are missing', () => {
    const req = mockRequest({ /* listing data with missing required fields */ });
    const res = mockResponse();
    (validationResult as any).mockImplementation(() => ({
      isEmpty: () => false,
      array: () => [{ msg: 'City is required', param: 'city' }]
    }));
    validateListing[lastIdx](req, res, nextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: expect.any(Array) });
  });

  it('should return 400 if data types are incorrect', () => {
    const req = mockRequest({ /* listing data with incorrect data types */ });
    const res = mockResponse();
    (validationResult as any).mockImplementation(() => ({
      isEmpty: () => false,
      array: () => [{ msg: 'Rent must be a number', param: 'rent' }]
    }));
    validateListing[lastIdx](req, res, nextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: expect.any(Array) });
  });
});


describe('Test for validateSearchParameters Middleware', () => {
  const mockRequest = (queryParams = {}) => ({
    query: queryParams
  }) as unknown as Request;

  it('should call next() for valid input', () => {
    const req = mockRequest({ city: 'New York', zipcode: '10001' });
    const res = mockResponse();
    validateSearchParameters[0](req, res, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid city', () => {
    const req = mockRequest({ city: '12345', zipcode: '10001' });
    const res = mockResponse();
    validateSearchParameters[0](req, res, nextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid city parameter' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid zipcode', () => {
    const req = mockRequest({ city: 'New York', zipcode: 'ABCDE' });
    const res = mockResponse();
    validateSearchParameters[0](req, res, nextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid zipcode parameter' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() when both city and zipcode are not provided', () => {
    const req = mockRequest({});
    const res = mockResponse();
    validateSearchParameters[0](req, res, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should call next() when city is provided but zipcode is not', () => {
    const req = mockRequest({ city: 'New York' });
    const res = mockResponse();
    validateSearchParameters[0](req, res, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should call next() when zipcode is provided but city is not', () => {
    const req = mockRequest({ zipcode: '10001' });
    const res = mockResponse();
    validateSearchParameters[0](req, res, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 for excessively long city name', () => {
    const longCityName = 'A'.repeat(51); // 51 characters
    const req = mockRequest({ city: longCityName });
    const res = mockResponse();
    validateSearchParameters[0](req, res, nextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid city parameter' });
  });

  it('should call next() for city with mixed case and spaces', () => {
    const req = mockRequest({ city: ' New York ' });
    const res = mockResponse();
    validateSearchParameters[0](req, res, nextFunction);
    expect(req.query.city).toBe('new york'); // After sanitization and lowercasing
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 400 for numeric city name', () => {
    const req = mockRequest({ city: '1234' });
    const res = mockResponse();
    validateSearchParameters[0](req, res, nextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid city parameter' });
  });

  it('should return 400 for zipcode with special characters', () => {
    const req = mockRequest({ zipcode: '123-45' });
    const res = mockResponse();
    validateSearchParameters[0](req, res, nextFunction);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid zipcode parameter' });
  });
});
