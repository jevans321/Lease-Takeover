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
const user = { id: 8 };
const listingId = 16;

describe('POST /bookmarks', () => {
  it('creates a bookmark', async () => {
    // Mock JWT token
    const token = jwt.sign({ user }, JWT_SECRET);

    const response = await request(app)
      .post('/bookmarks')
      .send({ listingId })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.message).toEqual(`Bookmark added with ID: ${response.body.listingId}`);
    expect(response.body.listingId).toBeDefined();
  });

  it('returns an error if listingId is not provided', async () => {
    // Mock JWT token
    const token = jwt.sign({ user }, JWT_SECRET);

    const response = await request(app)
      .post('/bookmarks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(expect.objectContaining({ msg: 'Listing ID must be a number' }));
  });

  it('on post bookmark, returns error if user not authenticated', async () => {
    const response = await request(app)
      .post('/bookmarks')
      .send({ listingId })
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
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

  it('on get bookmarks, returns error if user not authenticated', async () => {
    const response = await request(app).get('/bookmarks');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Not authenticated' });
  });
});
