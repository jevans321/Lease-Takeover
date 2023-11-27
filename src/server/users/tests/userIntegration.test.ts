import app from '../../server';
import { execSync } from 'child_process';
import request from 'supertest';

describe('/users/register', () => {
  beforeAll(() => {
    // Force reset the database and re-seed it
    execSync('npx prisma db push --force-reset && npm run db-seed');
  });
  it('should register a user successfully with valid data', async () => {
    const userData = {
      email: 'jestTestUser@example.com',
      password: 'strongpassword123456',
      firstName: 'JestFirstName',
      lastName: 'JestLastName'
    };

    const response = await request(app).post('/users/register').send(userData);
    expect(response.statusCode).toBe(201);
    expect(response.text).toContain('User added with ID:');
  });

  it('should return 400 for invalid email', async () => {
    const userData = {
      email: 'invalidemail',
      password: 'strongpassword123'
    };

    const response = await request(app).post('/users/register').send(userData);
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(expect.any(Array));
  });

  it('should reject registration with a duplicate email', async () => {
    const userData = {
      email: 'alice@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Doe'
    };
    const response = await request(app).post('/users/register').send(userData);
    expect(response.statusCode).toBe(500); // or the specific status code you use for this error
    expect(response.body).toEqual({ error: 'Email already in use' });
  });

  it('should return 400 for missing required fields', async () => {
    const userData = {
      email: 'newuser@example.com',
      // Omitting password to simulate a missing required field
    };
    const response = await request(app).post('/users/register').send(userData);
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ msg: 'Password must be at least 6 characters long' })
    );
  });

});

describe('/users/login', () => {
  beforeAll(() => {
    // Force reset the database and re-seed it
    execSync('npx prisma db push --force-reset && npm run db-seed');
  });
  it('should successfully login with valid credentials', async () => {
    const userData = {
      email: 'tito@example.com',
      password: 'password3'
    };
    const response = await request(app).post('/users/login').send(userData);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Login successful');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should return 400 for invalid email format', async () => {
    const userData = {
      email: 'invalidemail',
      password: 'password2'
    };

    const response = await request(app).post('/users/login').send(userData);
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ msg: 'Invalid email address' })
    );
  });

  it('should return 401 for incorrect credentials', async () => {
    const userData = {
      email: 'sky@example.com',
      password: 'wrongPassword'
    };

    const response = await request(app).post('/users/login').send(userData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: 'Error during login' });
  });

  // Additional tests for other scenarios...
});
