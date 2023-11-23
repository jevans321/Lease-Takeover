import { Request, Response } from 'express';
import { handleCreateBookmark, handleGetBookmarks } from '../bookmarkController';
import { createBookmark, getBookmarks } from '../bookmarkService';

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

describe('Tests for "handleCreateBookmark" middleware function', () => {
  const lastIdx = handleCreateBookmark.length - 1;

  it('should return 401 for unauthorized access', () => {
    (mockRequest as any).token = null; // Simulate an invalid token
    handleCreateBookmark[lastIdx](mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith('Unauthorized access');
  });

  it('should successfully create a bookmark and return its ID', async () => {
    const mockUserId = 1;
    const mockListingId = 10;
    const mockResult = { listingId: mockListingId };
    (mockRequest as any).token = { user: { id: mockUserId } };
    mockRequest.body = { listingId: mockListingId };
    (createBookmark as jest.Mock).mockResolvedValue(mockResult);
    await handleCreateBookmark[lastIdx](mockRequest, mockResponse, nextFunction);
    expect(createBookmark).toHaveBeenCalledWith({ userId: mockUserId, listingId: mockListingId });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: `Bookmark added with ID: ${mockResult.listingId}`,
      listingId: mockResult.listingId
    });
  });

  it('should handle errors when creating a bookmark', async () => {
    const mockUserId = 1;
    const mockListingId = 10;
    (mockRequest as any).token = { user: { id: mockUserId } };
    mockRequest.body = { listingId: mockListingId };
    const mockError = new Error('Database error');
    (createBookmark as jest.Mock).mockRejectedValue(mockError);
    await handleCreateBookmark[lastIdx](mockRequest, mockResponse, nextFunction);
    expect(createBookmark).toHaveBeenCalledWith({ userId: mockUserId, listingId: mockListingId });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error creating bookmark' });
  });

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
