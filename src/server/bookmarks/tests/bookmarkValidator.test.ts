import { Request, Response } from 'express';
import { validateBookmark } from '../bookmarkValidator';
import { validationResult } from 'express-validator';

jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn(),
}));

const mockRequest = (bodyData = {}) => ({
  body: bodyData
}) as Request;

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

describe('Tests for validateBookmark middleware array and functions', () => {
  it('should return an error if listingId is not numeric', () => {
    const req = mockRequest({ listingId: 'not-a-number' });
    const res = mockResponse();

    (validationResult as any).mockImplementation(() => ({
      isEmpty: () => false,
      array: () => [{ msg: 'Listing ID must be a number', param: 'listingId' }]
    }));

    validateBookmark[1](req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Listing ID must be a number', param: 'listingId' }]
    });
  });

  it('should call next() if validation is successful', () => {
    const req = mockRequest({ listingId: 123 });
    const res = mockResponse();

    (validationResult as any).mockImplementation(() => ({
      isEmpty: () => true
    }));

    validateBookmark[1](req, res, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });
});
