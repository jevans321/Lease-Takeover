import jwt, { VerifyErrors } from 'jsonwebtoken';
import { authenticateJWT } from '../middleware';
import { Request, Response } from 'express';
import { CustomRequest, CustomJwtPayload } from '../../utility/customTypes';

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));
const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  sendStatus: jest.fn()
} as unknown as Response;
const nextFunction = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Test JWT authentication', () => {

  it('should return 401 if the authorization header is missing', () => {
    mockRequest.headers = {};
    authenticateJWT(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
  });

  it('should return 403 for an invalid token', () => {
    mockRequest.headers = { authorization: 'Bearer invalidtoken' };
    (jwt.verify as jest.Mock).mockImplementation((_token, _secret, callback: (err: VerifyErrors | null, payload: CustomJwtPayload | undefined) => void) => {
      const error = new Error('Invalid token') as VerifyErrors;
      callback(error, undefined);
    });
    authenticateJWT(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should return 403 for an expired token', () => {
    mockRequest.headers = { authorization: 'Bearer expiredtoken' };
    (jwt.verify as jest.Mock).mockImplementation((_token, _secret, callback: (err: VerifyErrors | null, payload: CustomJwtPayload | undefined) => void) => {
      const error = new Error('Token expired') as VerifyErrors;
      error.name = 'TokenExpiredError';
      callback(error, undefined);
    });
    authenticateJWT(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token expired' });
  });

  it('should call next for a valid token', () => {
    mockRequest.headers = { authorization: 'Bearer validtoken' };
    const mockPayload = { id: 1, email: 'test@example.com' } as { id: number; email: string; };
    (jwt.verify as jest.Mock).mockImplementation((_token, _secret, callback: (err: VerifyErrors | null, payload: { id: number; email: string; } | undefined) => void) => {
      callback(null, mockPayload);
    });
    authenticateJWT(mockRequest, mockResponse, nextFunction);
    expect((mockRequest as CustomRequest).token).toEqual(mockPayload);
    expect(nextFunction).toHaveBeenCalled();
  });

});