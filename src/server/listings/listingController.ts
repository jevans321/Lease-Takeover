// listings/listingController.ts
// Handle the request/response operations related to listings
import { Request, Response } from 'express';
import { authenticateJWT } from '../middleware';
import { createListing, Listing, getListings, getListingById } from './listingService';
import { validateListing } from './listingValidator';

export const handleCreateListing = [
  authenticateJWT,
  ...validateListing,
  async (request: Request, response: Response) => {
    const listing: Listing = request.body;
    listing.user_id = (request as any).user.id; // get user id from the authenticated user

    try {
      const result = await createListing(listing);
      response.status(201).send(`Listing added with ID: ${result}`);
      // response.status(201).send(`Listing added with ID: ${result.insertId}`);
    } catch (error) {
      response.status(500).json({ error });
    }
  },
];

export const handleGetListings = [
  async (_: Request, response: Response) => {
    try {
      const result = await getListings();
      response.status(200).json(result.rows);
    } catch (error) {
      response.status(500).json({ error });
    }
  },
];

export const handleGetListingById = [
  async (request: Request, response: Response) => {
    const listing_id = parseInt(request.params.id);
    if (isNaN(listing_id)) {
      return response.status(400).json({ error: "Invalid listing id" });
    }

    try {
      const result = await getListingById(listing_id);
      if (result.rows.length === 0) {
        return response.status(404).json({ error: "Listing not found" });
      }

      response.status(200).json(result.rows[0]);
    } catch (error) {
      response.status(500).json({ error });
    }
  },
];
