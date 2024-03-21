import { prisma } from '../db/client.ts';
import { Prisma } from '@prisma/client';

export async function findCitiesBySearchTerm(searchTerm: string): Promise<string[]> {
  // Clean and sanitize the searchTerm
  const cleanedSearchTerm = searchTerm.trim().replace(/[^\w\s,]/gi, '').replace(/\s+/g, ' ');

  // Assume entire input is city name if there's no comma
  let cityPart = cleanedSearchTerm;
  let statePart = '';

  // If there's a comma, split and interpret as "City, State"
  if (cleanedSearchTerm.includes(',')) {
    const parts = cleanedSearchTerm.split(',').map(part => part.trim());
    cityPart = parts[0];
    statePart = parts.length > 1 ? parts[1] : '';
  }

  // Construct where condition based on provided input
  let whereCondition: Prisma.CityWhereInput = {};

  if (cityPart) {
    whereCondition = {
      AND: [ // Use AND to make sure both conditions (if present) are met
        { city: { startsWith: cityPart, mode: 'insensitive' as Prisma.QueryMode } },
        ...(statePart ? [{ state: { startsWith: statePart, mode: 'insensitive' as Prisma.QueryMode } }] : [])
      ],
    };
  }

  // Execute the Prisma findMany query
  const cities = await prisma.city.findMany({
    where: whereCondition,
    orderBy: [
      { state: 'asc' },
      { city: 'asc' },
    ],
    distinct: ['city', 'state'],
    take: 40,
  });

  // Format and return the results
  return cities.map(city => `${city.city}, ${city.state}`);
}
