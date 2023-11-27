import { Request, Response } from 'express';
import { handleCreateListing, handleGetListingById, handleGetListings } from '../listingController';
import { createListing, getListingById, getListings } from '../listingService'

jest.mock('../listingService', () => ({
  createListing: jest.fn(),
  getListingById: jest.fn(),
  getListings: jest.fn(),
}));

const mockRequestCreate = (bodyData = {}, userData: { id?: number } | null = {}) => ({
  body: bodyData,
  token: { user: userData }
}) as unknown as Request;

const mockRequestGet = (queryParams = {}) => ({
  query: queryParams
}) as unknown as Request;

const mockRequestGetById = (params = {}) => ({
  params: params
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
});

describe('Tests for handleCreateListing middleware function', () => {
  const lastIdx = handleCreateListing.length - 1;

  it('should return 401 for unauthorized access', async () => {
    const req = mockRequestCreate({}, null); // No user token
    const res = mockResponse();
    await handleCreateListing[lastIdx](req, res, nextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized access' });
  });

  it('should successfully create a listing and return its ID', async () => {
    const mockUserId = 1;
    const mockListingId = 100;
    const req = mockRequestCreate({ title: 'New Listing' }, { id: mockUserId });
    const res = mockResponse();
    (createListing as jest.Mock).mockResolvedValue({ id: mockListingId });
    await handleCreateListing[lastIdx](req, res, nextFunction);
    expect(createListing).toHaveBeenCalledWith({ ...req.body, authorId: mockUserId });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Listing added', listingId: mockListingId });
  });

  it('should handle errors when creating a listing', async () => {
    const mockUserId = 1;
    const req = mockRequestCreate({ title: 'New Listing' }, { id: mockUserId });
    const res = mockResponse();
    // This mock error will also console log the error
    const mockError = new Error('Database error');
    (createListing as jest.Mock).mockRejectedValue(mockError);
    await handleCreateListing[lastIdx](req, res, nextFunction);
    expect(createListing).toHaveBeenCalledWith({ ...req.body, authorId: mockUserId });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error creating listing' });
  });

});

describe('Tests for handleGetListings middleware function', () => {
  const lastIdx = handleGetListings.length - 1;

  it('should successfully retrieve listings', async () => {
    const req = mockRequestGet({ page: '1', limit: '10' });
    const res = mockResponse();
    const mockResult = [{ id: 1, title: 'Listing 1' }, { id: 2, title: 'Listing 2' }];
    (getListings as jest.Mock).mockResolvedValue(mockResult);
    await handleGetListings[lastIdx](req, res);
    expect(getListings).toHaveBeenCalledWith(1, 10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it('should handle errors when fetching listings', async () => {
    const req = mockRequestGet({ page: '1', limit: '10' });
    const res = mockResponse();
    const mockError = new Error('Database error');
    (getListings as jest.Mock).mockRejectedValue(mockError);
    await handleGetListings[lastIdx](req, res);
    expect(getListings).toHaveBeenCalledWith(1, 10);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching listings' });
  });

  it('should use default pagination parameters if not provided', async () => {
    const req = mockRequestGet();
    const res = mockResponse();
    const mockResult = [{ id: 3, title: 'Listing 3' }];
    (getListings as jest.Mock).mockResolvedValue(mockResult);
    await handleGetListings[lastIdx](req, res);
    expect(getListings).toHaveBeenCalledWith(1, 10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

});

describe('Tests for handleGetListingById middleware function', () => {
  const lastIdx = handleGetListingById.length - 1;

  it('should return 400 for invalid listing ID', async () => {
    const req = mockRequestGetById({ id: 'invalid' });
    const res = mockResponse();
    await handleGetListingById[lastIdx](req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid listing ID" });
  });

  it('should return 404 if listing is not found', async () => {
    const req = mockRequestGetById({ id: '123' });
    const res = mockResponse();
    (getListingById as jest.Mock).mockResolvedValue(null);
    await handleGetListingById[lastIdx](req, res);
    expect(getListingById).toHaveBeenCalledWith(123);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Listing not found" });
  });

  it('should successfully retrieve a listing', async () => {
    const mockListing = { id: 123, title: 'Test Listing' };
    const req = mockRequestGetById({ id: '123' });
    const res = mockResponse();
    (getListingById as jest.Mock).mockResolvedValue(mockListing);
    await handleGetListingById[lastIdx](req, res);
    expect(getListingById).toHaveBeenCalledWith(123);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockListing);
  });

  it('should handle errors when fetching a listing', async () => {
    const req = mockRequestGetById({ id: '123' });
    const res = mockResponse();
    const mockError = new Error('Database error');
    (getListingById as jest.Mock).mockRejectedValue(mockError);
    await handleGetListingById[lastIdx](req, res);
    expect(getListingById).toHaveBeenCalledWith(123);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error fetching listing" });
  });

});