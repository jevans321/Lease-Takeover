import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ListingSearchParams {
  location: string;
  propertyType: string;
  bedrooms: string;
}

interface Listing {
  // Define the listing object structure based on your API response
  id: number;
  title: string;
  // ...other properties
}

export const fetchListings = async (searchParams: ListingSearchParams): Promise<Listing[]> => {
  try {
    const response: AxiosResponse<Listing[]> = await axios.get(`${API_BASE_URL}/listings/search`, { params: searchParams });
    return response.data;
  } catch (error) {
    // You can throw a typed custom error if needed
    console.error('Error fetching listings:', error);
    throw error;
  }
};
