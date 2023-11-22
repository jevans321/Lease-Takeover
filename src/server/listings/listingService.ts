// listings/listingService.ts
// Handle business logic related to listings
import { pool } from '../db';

export interface Listing {
  title: string;
  description: string;
  location: string;
  price: number;
  user_id: number;
}

export async function createListing(listing: Listing) {
  const { title, description, location, price, user_id } = listing;

  const result = await pool.query(
    'INSERT INTO listings (title, description, location, price, user_id) VALUES ($1, $2, $3, $4, $5)',
    [title, description, location, price, user_id]
  );

  return result;
}

export async function getListings() {
  const result = await pool.query('SELECT * FROM listings');
  return result;
}

export async function getListingById(listing_id: number) {
  const result = await pool.query('SELECT * FROM listings WHERE id = $1', [listing_id]);
  return result;
}