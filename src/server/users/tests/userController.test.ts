import { handleLoginUser, handleRegisterUser } from '../userController';
import { Request, Response } from 'express';
import { loginUser, registerUser } from '../userService';

jest.mock('../userService');

describe('handleRegisterUser', () => {
  const lastIdx = handleRegisterUser.length - 1;
  const registerFunction = handleRegisterUser[lastIdx] as (request: Request, response: Response) => Promise<void>;

  it('should create a new user and return the user ID', async () => {
    const mockRequest = {
      body: {
        email: 'test@example.com',
        password: '123456',
      },
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const mockUser = { insertId: 1 };
    (registerUser as jest.Mock).mockResolvedValue(mockUser);

    await registerFunction(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith(`User added with ID: ${mockUser.insertId}`);
  });

  it('should handle errors and return a status of 500', async () => {
    const mockRequest = {
      body: {
        email: 'test@example.com',
        password: '123456',
      },
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockError = { message: 'An error occurred' };
    (registerUser as jest.Mock).mockRejectedValue(mockError);

    await registerFunction(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError });
  });
});

describe('handleLoginUser', () => {
  const loginFunction = handleLoginUser[1] as (request: Request, response: Response) => Promise<void>;

  it('should login the user and return a JWT token', async () => {
    const mockRequest = {
      body: {
        email: 'test@example.com',
        password: '123456',
      },
    } as Request;

    const mockResponse = {
      json: jest.fn(),
    } as unknown as Response;

    const mockUser = { email: 'test@example.com' };
    (loginUser as jest.Mock).mockResolvedValue(mockUser);

    await loginFunction(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  it('should handle errors and return a status of 500', async () => {
    const mockRequest = {
      body: {
        email: 'test@example.com',
        password: '123456',
      },
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockError = { message: 'An error occurred' };
    (loginUser as jest.Mock).mockRejectedValue(mockError);

    await loginFunction(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError });
  });
});