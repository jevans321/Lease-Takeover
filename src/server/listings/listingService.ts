// listings/listingService.ts
// Handle business logic related to listings
import { prisma } from '../db/client.ts';

export interface Listing {
  authorId: number;
  description: string;
  location: string;
  published: boolean;
  rent: number;
  title: string;
}

export async function createListing(listing: Listing) {
  const { authorId, description, location, published, rent, title } = listing;
  try {
    // TODO: Add image upload functionality here, store the image in S3, and get the URL
    const imageUrl = ''; // Placeholder for the S3 image URL after upload
    const result = await prisma.listing.create({
      data: {
        authorId,
        description,
        imageUrl, // Updated to use the imageUrl from S3
        location,
        published,
        rent,
        title
      }
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating listing');
  }
}

export async function getListings(page: number, pageSize: number) {
  try {
    // Calculate the starting point for the listings
    const skip = (page - 1) * pageSize;
    const result = await prisma.listing.findMany({
      skip: skip,
      take: pageSize,
      // Optionally, you can add orderBy here for sorting
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching listings');
  }
}

export async function getListingById(listingId: number) {
  try {
    const result = await prisma.listing.findUnique({
      where: {
        id: listingId
      }
    });
    if (result == null) {
      throw new Error('Listing not found');
    }
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching listing by ID');
  }
}
