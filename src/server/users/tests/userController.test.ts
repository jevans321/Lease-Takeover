import { handleLoginUser, handleRegisterUser } from '../userController';
import { loginUser, registerUser } from '../userService';
import { Request, Response } from 'express';
import { mocked } from 'jest-mock'
import jwt from 'jsonwebtoken';

jest.mock('../userService');
jest.mock('jsonwebtoken'); // Optionally mock jsonwebtoken if you want to avoid generating real tokens in the test

describe('handleRegisterUser', () => {
  const lastIdx = handleRegisterUser.length - 1;
  const registerFunction = handleRegisterUser[lastIdx] as (request: Request, response: Response) => Promise<void>;

  it('should create a new user and return the user ID', async () => {
    /*
      • This test does not touch actual db.
      • The function that queries the db 'registerUser' is mocked here.
      • We're just testing middleware function registerFunction and
        making sure all the logic surrounding the db function 'registerUser' works.
    */
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

    const mockUser = { id: 3 };
    /* 'registerUser' is an imported function called within the handleRegisterUser middleware.
       when 'registerUser' is called in 'registerFunction', the 'mockUser' value is returned
       in the response. */
    (registerUser as jest.Mock).mockResolvedValue(mockUser);

    await registerFunction(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith(`User added with ID: ${mockUser.id}`);
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
  const lastIdx = handleLoginUser.length - 1;
  const loginFunction = handleLoginUser[lastIdx] as (request: Request, response: Response) => Promise<void>;

  it('should login the user and return a JWT token', async () => {
    // Mock JWT token generation
    const mockToken = 'mocked.jwt.token';
    const mockedJwt = mocked(jwt);
    mockedJwt.sign.mockImplementation(() => mockToken);

    const mockRequest = {
      body: {
        email: 'test@example.com',
        password: '123456',
      },
    } as Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    const mockUser = { id: 4, email: 'test@example.com' };
    (loginUser as jest.Mock).mockResolvedValue(mockUser);

    await loginFunction(mockRequest, mockResponse);
    expect(loginUser).toHaveBeenCalledWith(mockRequest.body);
    expect(jwt.sign).toHaveBeenCalledWith({ _id: mockUser.id.toString(), email: mockUser.email }, expect.anything(), { expiresIn: "20m" });
    expect(mockResponse.cookie).toHaveBeenCalledWith("token", mockToken, { httpOnly: true });
    expect(mockResponse.json).toHaveBeenCalledWith({ accessToken: mockToken });
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