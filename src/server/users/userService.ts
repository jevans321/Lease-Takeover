/* users/userService.ts
   Contains business logic related to users
   (like registering and logging in a user) in this file */
import bcrypt from 'bcrypt';
import { prisma } from '../db/client.ts';

const saltRounds = 10;

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: string;
}

export async function registerUser(user: User) {
  const { email, firstName, lastName, password, userType } = user;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,   // Optional, can be null
        lastName,    // Optional, can be null
        password: hashedPassword,
        userType
      }
    });
    const { password: _, ...userData } = newUser;
    return userData;
  } catch (error: any) {
    if (error?.code === 'P2002') { // Prisma unique constraint violation
      throw new Error('Email already in use');
    } else {
      throw error; // or handle other types of errors as needed
    }
  }
}

export async function loginUser(user: { email: string; password: string }) {
  try {
    const { email, password } = user;
    const userInDb = await prisma.user.findFirst({
      where: {
        email
      }
    });
    if (userInDb === null) {
      throw new Error('Invalid email or password');
    }
    const passwordMatch = await bcrypt.compare(password, userInDb.password);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }
    // Select and return only necessary fields
    const { password: _, ...userData } = userInDb;
    return userData;
  } catch (error) {
    throw error;
  }
}

