import app from '../../server';
import { execSync } from 'child_process';
import jwt from 'jsonwebtoken';
import request from 'supertest';

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const user = { id: 2 };
const token = jwt.sign({ user }, JWT_SECRET);
const validBookmarkData = {
  listingId: 12, // Assuming this is a valid listing ID
};

describe('POST /bookmarks', () => {
  beforeAll(() => {
    // Force reset the database and re-seed it
    execSync('npx prisma db push --force-reset && npm run db-seed');
  });
  it('should create a bookmark successfully with valid data and authentication', async () => {
    const response = await request(app)
      .post('/bookmarks')
      .set('Authorization', `Bearer ${token}`)
      .send(validBookmarkData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Bookmark added with ID:');
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .post('/bookmarks')
      .send(validBookmarkData);
    expect(response.statusCode).toBe(401);
  });

  it('should return 400 for validation errors', async () => {
    const invalidBookmarkData = { listingId: 'invalid' }; // Introducing a validation error
    const response = await request(app)
      .post('/bookmarks')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBookmarkData);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
});


describe('GET /bookmarks', () => {
  beforeAll(() => {
    // Force reset the database and re-seed it
    execSync('npx prisma db push --force-reset && npm run db-seed');
  });
  it('should retrieve bookmarks successfully for authenticated users', async () => {
    const response_seed = await request(app)
      .post('/bookmarks')
      .set('Authorization', `Bearer ${token}`)
      .send(validBookmarkData);
    expect(response_seed.statusCode).toBe(201);
    expect(response_seed.body).toHaveProperty('message');
    expect(response_seed.body.message).toContain('Bookmark added with ID:');

    const response = await request(app)
      .get('/bookmarks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]).toHaveProperty('userId', 2);
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .get('/bookmarks');
    expect(response.statusCode).toBe(401);
  });

  it('should handle server errors', async () => {
    const invalidToken = 'invalid.jwt.token';
    const response = await request(app)
      .get('/bookmarks')
      .set('Authorization', `Bearer ${invalidToken}`);
    expect(response.statusCode).toBe(403);
  });
});
