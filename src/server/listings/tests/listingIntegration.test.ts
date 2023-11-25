import jwt from 'jsonwebtoken';
import request from 'supertest';
import express, { Request, Response } from 'express';
import { handleCreateListing, handleGetListings, handleGetListingById } from '../listingController';
import app from '../../server';

app.use(express.json());

// Define your routes
app.post('/listings', handleCreateListing, (_req: Request, res: Response) => res.sendStatus(204));
app.get('/listings', handleGetListings, (_req: Request, res: Response) => res.sendStatus(200));
app.get('/listings/:id', handleGetListingById, (_req: Request, res: Response) => res.sendStatus(200));

// Mock user
const user = { id: 1 };
const JWT_SECRET = 'your-secret-here'; // Replace with your JWT secret
const token = jwt.sign({ user }, JWT_SECRET);

const validListing = {
  title: "Cozy Apartment",
  description: "2 BHK apartment in the city center",
  location: "New York",
  price: 1200
};

describe('handleCreateListing', () => {
  it('creates a listing', async () => {
    const response = await request(app)
      .post('/listings')
      .send(validListing)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('returns an error if title is missing', async () => {
    const invalidListing = { ...validListing, title: "" };

    const response = await request(app)
      .post('/listings')
      .send(invalidListing)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(expect.objectContaining({ msg: 'Title is required' }));
  });

  // Create similar test cases for other fields like 'description', 'location' and 'price'

  it('returns an error if user is not authenticated', async () => {
    const response = await request(app)
      .post('/listings')
      .send(validListing)
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Not authenticated' });
  });
});

describe('handleGetListings', () => {
  it('retrieves all listings', async () => {
    const response = await request(app)
      .get('/listings')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    // Add more expectations based on the expected structure of your listings
    // For example, if you know that you should have at least one listing in your test database:
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe('handleGetListingById', () => {
  it('retrieves a specific listing', async () => {
    const response = await request(app)
      .get('/listings/1')  // Assume that a listing with ID 1 exists
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    // Add more expectations based on the expected structure of your listing
    // For example, if you know that the listing with ID 1 has a specific title:
    expect(response.body.title).toBe("Specific Title");
  });

  it('returns a 404 error if the listing does not exist', async () => {
    const response = await request(app)
      .get('/listings/9999')  // Assume that a listing with ID 9999 does not exist
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
  });
});

describe('handleCreateListing validation', () => {
  it('rejects invalid title', async () => {
    const invalidListing = {
      title: "", // Invalid title
      description: "A great place",
      location: "Anywhere, USA",
      price: 1000
    };

    const response = await request(app)
      .post('/listings')
      .send(invalidListing)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(expect.objectContaining({ msg: 'Title is required' }));
  });

  it('rejects invalid description', async () => {
    const invalidListing = {
      title: "Nice Place",
      description: "", // Invalid description
      location: "Anywhere, USA",
      price: 1000
    };

    const response = await request(app)
      .post('/listings')
      .send(invalidListing)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(expect.objectContaining({ msg: 'Description is required' }));
  });

  it('rejects invalid location', async () => {
    const invalidListing = {
      title: "Nice Place",
      description: "A great place",
      location: "", // Invalid location
      price: 1000
    };

    const response = await request(app)
      .post('/listings')
      .send(invalidListing)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(expect.objectContaining({ msg: 'Location is required' }));
  });

  it('rejects invalid price', async () => {
    const invalidListing = {
      title: "Nice Place",
      description: "A great place",
      location: "Anywhere, USA",
      price: "invalid" // Invalid price
    };

    const response = await request(app)
      .post('/listings')
      .send(invalidListing)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(expect.objectContaining({ msg: 'Price must be a number' }));
  });

  it('accepts valid data', async () => {
    const validListing = {
      title: "Nice Place",
      description: "A great place",
      location: "Anywhere, USA",
      price: 1000
    };

    const response = await request(app)
      .post('/listings')
      .send(validListing)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
  });
});
