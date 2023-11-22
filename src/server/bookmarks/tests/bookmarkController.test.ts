// __tests__/bookmarkController.test.ts

import jwt from 'jsonwebtoken';
import request from 'supertest';
import express from 'express';
import { handleCreateBookmark, handleGetBookmarks } from '../bookmarkController';
import app from '../../server';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

app.use(express.json());

// Define your routes
app.post('/bookmarks', handleCreateBookmark);
app.get('/bookmarks', handleGetBookmarks);

// Mock user and listing id
const user = { id: 1 };
const listing_id = 1;

describe('POST /bookmarks', () => {
  it('creates a bookmark', async () => {
    // Mock JWT token
    const token = jwt.sign({ user }, JWT_SECRET);

    const response = await request(app)
      .post('/bookmarks')
      .send({ listing_id })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(`Bookmark added with ID: ${response.body.insertId}`);
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

describe('GET /bookmarks', () => {
  it('retrieves bookmarks', async () => {
    // Mock JWT token
    const token = jwt.sign({ user }, JWT_SECRET);

    const response = await request(app)
      .get('/bookmarks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('returns an error if user is not authenticated', async () => {
    const response = await request(app).get('/bookmarks');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Not authenticated' });
  });
});
