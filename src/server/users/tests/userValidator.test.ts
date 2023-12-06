import express, { Request, Response } from 'express';
import request from 'supertest';
import { validateLoginUser, validateRegisterUser } from '../userValidator';

const app = express();
app.use(express.json());

app.post('/users/login', validateLoginUser, (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.post('/users/register', validateRegisterUser, (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

describe('Check validateLoginUser via POST /users/login', () => {
  it('should return 200 status code OK', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com', password: '123456' });

    // A status 200 shows that the 'next' function is being called from the "app.post()"
    //  • because the next function is the callback function that send the 200 response.
    expect(res.status).toBe(200);
  });

  it('should return 400 status code for invalid request body', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'invalidEmail', password: '123' });

    expect(res.status).toBe(400);
  });
});


describe('Register User Validation Middleware', () => {
  it('should reject an invalid email', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ email: 'invalid-email', password: 'Valid1!' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Invalid email address',
        }),
      ]),
    );
  });

  it('should reject a password that is too short', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ email: 'test@example.com', password: 'Short1!' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Password must be at least 8 characters long',
        }),
      ]),
    );
  });

  it('should reject a password without an uppercase letter', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ email: 'test@example.com', password: 'valid1!' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Password must contain at least one uppercase letter',
        }),
      ]),
    );
  });

  it('should reject a password without a lowercase letter', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ email: 'test@example.com', password: 'VALID1!' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Password must contain at least one lowercase letter',
        }),
      ]),
    );
  });

  it('should reject a password without a number', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ email: 'test@example.com', password: 'Validone!' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Password must contain at least one number',
        }),
      ]),
    );
  });

  it('should reject a password without a special character', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ email: 'test@example.com', password: 'ValidOne1' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Password must contain at least one special character',
        }),
      ]),
    );
  });
});