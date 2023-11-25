import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { validateListing } from '../listingValidator';

// Mock validationResult from express-validator
jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn(),
}));

const mockRequest = (bodyData = {}) => ({
  body: bodyData
}) as unknown as Request;

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