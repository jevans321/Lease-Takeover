import { prisma } from '../db/client.ts';
import { Prisma } from '@prisma/client';

export async function findCitiesBySearchTerm(searchTerm: string): Promise<string[]> {
  // Clean and sanitize the searchTerm
  const cleanedSearchTerm = searchTerm.trim().replace(/[^\w\s,]/gi, '').replace(/\s+/g, ' ');
  const parts = cleanedSearchTerm.includes(',')
    ? cleanedSearchTerm.split(',').map(part => part.trim())
    : cleanedSearchTerm.split(' ').map(part => part.trim());

  let cityPart = parts[0] || '';
  let statePart = parts.length > 1 ? parts[1] : '';

  // Construct where condition based on provided input
  let whereCondition: Prisma.CityWhereInput = {};

  if (cityPart && statePart) {
    // User provided both city and state information
    whereCondition = {
      AND: [
        { city: { startsWith: cityPart, mode: 'insensitive' as Prisma.QueryMode } },
        { state: { startsWith: statePart, mode: 'insensitive' as Prisma.QueryMode } }
      ],
    };
  } else if (cityPart) {
    // User provided only city information
    whereCondition = {
      city: { startsWith: cityPart, mode: 'insensitive' as Prisma.QueryMode },
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