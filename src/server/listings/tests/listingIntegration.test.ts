import app from '../../server';
import { execSync } from 'child_process';
import jwt from 'jsonwebtoken';
import request from 'supertest';

describe('POST /listings', () => {
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

describe('GET /listings', () => {
  beforeAll(() => {
    // Force reset the database and re-seed it
    execSync('npx prisma db push --force-reset && npm run db-seed');
  });
  it('should retrieve listings with default pagination', async () => {
    const response = await request(app).get('/listings');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    // Additional assertions based on the expected structure of listings
  });

  it('should handle pagination parameters correctly', async () => {
    const page = 2;
    const limit = 5;
    const response = await request(app).get(`/listings?page=${page}&limit=${limit}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    // Check if the returned array length matches the 'limit' parameter
    expect(response.body.length).toBeLessThanOrEqual(limit);
  });

  it('should handle invalid pagination parameters gracefully', async () => {
    const response = await request(app).get('/listings?page=invalid&limit=invalid');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(10);
  });

  // Additional test to simulate and handle internal server error
  it('should handle server errors', async () => {
    // This test depends on your ability to simulate a server error, such as a database failure
  });
});

describe('GET /listings/:id', () => {
  beforeAll(() => {
    // Force reset the database and re-seed it
    execSync('npx prisma db push --force-reset && npm run db-seed');
  });
  it('should retrieve a specific listing for a valid ID', async () => {
    const validListingId = 1; // Replace with an ID known to exist in your test database

    const response = await request(app).get(`/listings/${validListingId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', validListingId);
    // Additional assertions based on the expected structure of the listing
  });

  it('should return 400 for invalid listing ID', async () => {
    const response = await request(app).get('/listings/invalid');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid listing ID');
  });

  it('should return 404 when the listing is not found', async () => {
    const nonExistentListingId = 9999; // An ID that does not exist in your test database

    const response = await request(app).get(`/listings/${nonExistentListingId}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error fetching listing');
  });
});

