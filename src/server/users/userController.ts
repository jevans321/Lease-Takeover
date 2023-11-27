/* users/userController.ts
   Handle request/response operations related to users in this file */
import { Request, Response } from 'express';
import { registerUser, loginUser, User } from './userService';
import jwt from 'jsonwebtoken';
import { validateLoginUser, validateRegisterUser } from './userValidator';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

export const handleRegisterUser = [
  ...validateRegisterUser,
  async (request: Request, response: Response) => {
    const user: User = request.body;
    try {
      const result = await registerUser(user);
      response.status(201).send(`User added with ID: ${result.id}`);
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        response.status(500).json({ error: error.message });
      } else {
        response.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  },
];

export const handleLoginUser = [
  ...validateLoginUser,
  async (req: Request, res: Response) => {
    const user: User = req.body;
    try {
      const userInDb = await loginUser(user);
      if (!userInDb) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const accessToken = jwt.sign({ _id: userInDb.id?.toString(), email: userInDb.email }, JWT_SECRET, { expiresIn: "20m" });
      res.cookie("token", accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.status(200).send("Login successful");
      // return response.redirect("/welcome");
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Error during login" });
    }
  },
];

