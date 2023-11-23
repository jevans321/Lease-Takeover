import { Request, Response } from 'express';
import { handleGetBookmarks } from '../bookmarkController';
import { getBookmarks } from '../bookmarkService';

// Mock the getBookmarks service
jest.mock('../bookmarkService');

const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
} as unknown as Response;
const nextFunction = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Tests for "handleGetBookmarks" middleware function', () => {

  it('should return 401 if the token is invalid', () => {
    (mockRequest as any).token = 'invalidtokenstring';
    handleGetBookmarks[1](mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should successfully fetch bookmarks and return them', async () => {
    const mockUserId = 1;
    const mockBookmarks = [{ id: 1, title: 'Bookmark 1' }, { id: 2, title: 'Bookmark 2' }];
    (mockRequest as any).token = { user: { id: mockUserId } };
    (getBookmarks as jest.Mock).mockResolvedValue(mockBookmarks);
    await handleGetBookmarks[1](mockRequest, mockResponse, nextFunction);
    expect(getBookmarks).toHaveBeenCalledWith(mockUserId);
    expect(mockResponse.json).toHaveBeenCalledWith(mockBookmarks);
  });

  it('should handle errors when fetching bookmarks', async () => {
    const mockUserId = 1;
    const mockError = new Error('Database error');
    (mockRequest as any).token = { user: { id: mockUserId } };
    (getBookmarks as jest.Mock).mockRejectedValue(mockError);
    await handleGetBookmarks[1](mockRequest, mockResponse, nextFunction);
    expect(getBookmarks).toHaveBeenCalledWith(mockUserId);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error fetching bookmarks' });
  });

});
