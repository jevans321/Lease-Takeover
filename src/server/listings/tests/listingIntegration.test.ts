import app from '../../server';
import { execSync } from 'child_process';
import jwt from 'jsonwebtoken';
import request from 'supertest';

describe('/listings', () => {
  beforeAll(() => {
    // Force reset the database and re-seed it
    execSync('npx prisma db push --force-reset && npm run db-seed');
  });
  const validListingData = {
    title: 'Charming Studio Apartment',
    description: 'A lovely studio apartment in the heart of the city.',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    rent: 1500,
    leaseStart: new Date().toISOString(),
    propertyType: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    petFriendly: false,
    utilitiesIncluded: true,
    amenities: ['Gym', 'Pool']
  };
  // Mock user
  const user = { id: 1 };
  const JWT_SECRET = process.env.JWT_SECRET ?? '';
  const token = jwt.sign({ user }, JWT_SECRET);

  it('should create a listing successfully with valid data and authentication', async () => {
    const response = await request(app)
      .post('/listings')
      .set('Authorization', `Bearer ${token}`)
      .send(validListingData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('listingId');
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .post('/listings')
      .send(validListingData);
    expect(response.statusCode).toBe(401);
  });

  it('should return 400 for validation errors', async () => {
    const invalidListingData = { ...validListingData, rent: 'invalidRentValue' }; // Introducing a validation error
    const response = await request(app)
      .post('/listings')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidListingData);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
});
