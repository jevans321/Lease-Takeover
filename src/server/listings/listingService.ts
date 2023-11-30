// listings/listingService.ts
// Handle business logic related to listings
import { Listing } from '../utility/appTypes.ts'
import { prisma } from '../db/client.ts';

export async function createListing(listing: Listing) {
  try {
    // TODO: Add image upload functionality here, store the image in S3, and get the URL
    const imageUrl = ''; // Placeholder for the S3 image URL after upload
    const result = await prisma.listing.create({
      data: {
        amenities: listing.amenities,
        authorId: listing.authorId,
        bathrooms: listing.bathrooms,
        bedrooms: listing.bedrooms,
        city: listing.city,
        description: listing.description,
        furnished: listing.furnished,
        imageUrl, // Updated to use the imageUrl from S3
        leaseEnd: listing.leaseEnd,
        leaseStart: listing.leaseStart,
        leaseType: listing.leaseType,
        location: listing.location,
        petFriendly: listing.petFriendly,
        propertyType: listing.propertyType,
        published: listing.published,
        rent: listing.rent,
        state: listing.state,
        title: listing.title,
        utilitiesIncluded: listing.utilitiesIncluded,
        zipCode: listing.zipCode
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

export async function getListingsBySearchParameters(city: string | undefined, zipcode: string | undefined) {
  try {
    const result = await prisma.listing.findMany({
      where: {
        OR: [
          { city: city },
          { zipCode: zipcode }
        ],
      },
    });
    return result;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw new Error('Error fetching listings');
  }
}
