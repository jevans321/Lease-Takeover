// __tests__/listingValidator.test.ts

import request from 'supertest';
import express, { Express, Request, Response } from 'express';
import { validateListing } from '../listingValidator';

let app: Express;

beforeAll(() => {
  // create a new express application for testing
  app = express();
  app.use(express.json()); // for parsing application/json

  // this is a dummy endpoint for testing validateListing
  app.post('/test-validate-listing', validateListing, (_req: Request, res: Response) => {
    res.status(200).send('Passed validation');
  });
});

// A valid listing object to use in the tests
const validListing = {
  title: 'A valid title',
  description: 'A valid description',
  location: 'A valid location',
  price: 100,
};

test('POST /test-validate-listing - success case', async () => {
  const result = await request(app)
    .post('/test-validate-listing')
    .send(validListing);

  expect(result.status).toBe(200);
  expect(result.text).toBe('Passed validation');
});

// Tests for 'title' field
test('POST /test-validate-listing - failure case - title missing', async () => {
  const invalidListing = { ...validListing, title: '' };

  const result = await request(app)
    .post('/test-validate-listing')
    .send(invalidListing);

  expect(result.status).toBe(400);
  expect(result.body.errors[0].msg).toBe('Title is required');
});

// Tests for 'description' field
test('POST /test-validate-listing - failure case - description missing', async () => {
  const invalidListing = { ...validListing, description: '' };

  const result = await request(app)
    .post('/test-validate-listing')
    .send(invalidListing);

  expect(result.status).toBe(400);
  expect(result.body.errors[0].msg).toBe('Description is required');
});

// Tests for 'location' field
test('POST /test-validate-listing - failure case - location missing', async () => {
  const invalidListing = { ...validListing, location: '' };

  const result = await request(app)
    .post('/test-validate-listing')
    .send(invalidListing);

  expect(result.status).toBe(400);
  expect(result.body.errors[0].msg).toBe('Location is required');
});

// Tests for 'price' field
test('POST /test-validate-listing - failure case - price missing', async () => {
  const invalidListing = { ...validListing, price: '' };

  const result = await request(app)
    .post('/test-validate-listing')
    .send(invalidListing);

  expect(result.status).toBe(400);
  expect(result.body.errors[0].msg).toBe('Price must be a number');
});

test('POST /test-validate-listing - failure case - price is not a number', async () => {
  const invalidListing = { ...validListing, price: 'not a number' };

  const result = await request(app)
    .post('/test-validate-listing')
    .send(invalidListing);

  expect(result.status).toBe(400);
  expect(result.body.errors[0].msg).toBe('Price must be a number');
});

