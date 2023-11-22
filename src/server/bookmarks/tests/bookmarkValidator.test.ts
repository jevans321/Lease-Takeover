import jwt from 'jsonwebtoken';
import request from 'supertest';
import express, { Request, Response } from 'express';
import { validateBookmark } from '../bookmarkValidator';
import app from '../../server';

app.use(express.json());

// Define your routes
app.post('/bookmarks', validateBookmark, (_req: Request, res: Response) => res.sendStatus(204));

// Your JWT Secret for testing
const JWT_SECRET = "your_jwt_secret";

// Mock user and listing id
const user = { id: 1 };
const listing_id = 1;

describe('validateBookmark', () => {
  it('validates a bookmark', async () => {
    // Mock JWT token
    const token = jwt.sign({ user }, JWT_SECRET);

    const response = await request(app)
      .post('/bookmarks')
      .send({ listing_id })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('returns an error if listing_id is not provided', async () => {
    // Mock JWT token
    const token = jwt.sign({ user }, JWT_SECRET);

    const response = await request(app)
      .post('/bookmarks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(expect.objectContaining({ msg: 'Listing ID must be a number' }));
  });

  it('returns an error if user is not authenticated', async () => {
    const response = await request(app)
      .post('/bookmarks')
      .send({ listing_id })
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Not authenticated' });
  });
});
