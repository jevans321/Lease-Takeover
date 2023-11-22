/* users/userService.ts
   Contains business logic related to users
   (like registering and logging in a user) in this file */
import bcrypt from 'bcrypt';
import { pool } from '../db';

const saltRounds = 10;

export interface User {
  email: string;
  password: string;
}

export async function registerUser(user: User) {
  const { email, password } = user;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const result = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2)',
    [email, hashedPassword]
  );

  return result;
}

export async function loginUser(user: User) {
  const { email, password } = user;

  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  const userInDb = result.rows[0];

  const passwordMatch = await bcrypt.compare(password, userInDb.password);

  if (!passwordMatch) {
    throw new Error('Invalid password');
  }

  return userInDb;
}
