import app from '../../server';
import { execSync } from 'child_process';
import jwt from 'jsonwebtoken';
import request from 'supertest';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

describe('/bookmarks', () => {
  beforeAll(() => {
    // Force reset the database and re-seed it
    execSync('npx prisma db push --force-reset && npm run db-seed');
  });
  const user = { id: 2 };
  const token = jwt.sign({ user }, JWT_SECRET);
  const validBookmarkData = {
    listingId: 12, // Assuming this is a valid listing ID
  };

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
