// listings/listingController.ts
// Handle the request/response operations related to listings
import { Request, Response } from 'express';
import { authenticateJWT } from '../middleware/middleware';
import { createListing, getListings, getListingById, getListingsBySearchParameters } from './listingService';
import { validateListing, validateSearchParameters } from './listingValidator';
import { CustomRequest } from '../utility/appTypes';

export const handleCreateListing = [
  authenticateJWT,
  ...validateListing,
  async (request: Request, response: Response) => {
    const token = (request as CustomRequest).token;
    // Assuming `token` is an object with user info on successful authentication
    if (token == null || typeof token !== "object" || !token.user || !token.user.id) {
      return response.status(401).json({ message: 'Unauthorized access' });
    }
    const listingData = {
      ...request.body,
      authorId: token.user.id
    };
    try {
      const result = await createListing(listingData);
      response.status(201).json({ message: 'Listing added', listingId: result.id });
    } catch (error) {
      console.error('Error creating listing:', error);
      response.status(500).json({ message: 'Error creating listing' });
    }
  },
];

export const handleGetSearchListings = [
  ...validateSearchParameters,
  async (request: Request, response: Response) => {
    try {
      const city = typeof request.query.city === 'string' ? request.query.city : undefined;
      const zipcode = typeof request.query.zipcode === 'string' ? request.query.zipcode : undefined;
      const result = await getListingsBySearchParameters(city, zipcode);
      response.status(200).json(result);
    } catch (error) {
      console.error('Error fetching listings:', error);
      response.status(500).json({ message: 'Error fetching listings' });
    }
  },
];



export const handleGetListings = [
  async (request: Request, response: Response) => {
    try {
      const page = parseInt(request.query.page as string) || 1;
      const limit = parseInt(request.query.limit as string) || 10;

      // Validate and sanitize 'page' and 'limit' if necessary

      const result = await getListings(page, limit);
      response.status(200).json(result);
    } catch (error) {
      console.error('Error fetching listings:', error);
      response.status(500).json({ message: 'Error fetching listings' });
    }
  },
];

export const handleGetListingById = [
  async (request: Request, response: Response) => {
    const listingId = parseInt(request.params.id, 10); // Base 10 for parsing

    if (isNaN(listingId)) {
      return response.status(400).json({ message: "Invalid listing ID" });
    }
    try {
      const result = await getListingById(listingId);
      if (result == null) {
        return response.status(404).json({ message: "Listing not found" });
      }
      response.status(200).json(result);
    } catch (error) {
      console.error('Error fetching listing:', error);
      response.status(500).json({ message: "Error fetching listing" });
    }
  },
];

