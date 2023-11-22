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
    console.log('ehhh: ', JWT_SECRET)
    try {
      const result = await registerUser(user);
      response.status(201).send(`User added with ID: ${result}`);
      // response.status(201).send(`User added with ID: ${result.insertId}`);
    } catch (error) {
      response.status(500).json({ error });
    }
  },
];

export const handleLoginUser = [
  ...validateLoginUser,
  async (request: Request, response: Response) => {
    const user: User = request.body;

    try {
      const userInDb = await loginUser(user);

      const accessToken = jwt.sign({ _id: userInDb._id?.toString(), email: userInDb.email }, JWT_SECRET, { expiresIn: "20m" });
      // response should send cookie back to clients browser. Client should automatically set cookie in browser
      response.cookie("token", accessToken, { httpOnly: true });
      response.json({ accessToken });

      // redirect user to welcome, dashboard, or main page
      // return response.redirect("/welcome");
    } catch (error) {
      response.status(500).json({ error });
    }
  },
];

