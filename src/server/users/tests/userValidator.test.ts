import express, { Request, Response } from 'express';
import request from 'supertest';
import { validateLoginUser } from '../userValidator';

const app = express();
app.use(express.json());

app.post('/users/login', validateLoginUser, (_req: Request, res: Response) => {
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