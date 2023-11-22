// bookmarks/bookmarkController.ts
// Handle the request/response operations related to bookmarks
import { Request, Response } from 'express';
import { authenticateJWT } from '../middleware';
import { createBookmark, getBookmarks, Bookmark } from './bookmarkService';
import { validateBookmark } from './bookmarkValidator';
import { CustomRequest } from '../customTypes';

export const handleCreateBookmark = [
  authenticateJWT,
  ...validateBookmark,
  async (request: Request, response: Response) => {
    const token = (request as CustomRequest).token;
    if (typeof token === "string") {
      response.status(500).send('Token is invalid');
    } else {
      const bookmark: Bookmark = {
        userId: token.user.id, // get user id from the authenticated user
        listingId: request.body.listing_id,
      };

      try {
        const result = await createBookmark(bookmark);
        response.status(201).send(`Bookmark added with ID: ${result}`);
        // response.status(201).send(`Bookmark added with ID: ${result.insertId}`);
      } catch (error) {
        response.status(500).json({ error });
      }
    }
  },
];

export const handleGetBookmarks = [
  authenticateJWT,
  async (request: Request, response: Response) => {
    const token = (request as CustomRequest).token;
    if (typeof token === "string") {
      response.status(500).send('Token is invalid');
    } else {
      const user_id = token.user.id; // get user id from the authenticated user
      try {
        const result = await getBookmarks(user_id);
        response.status(200).json(result.rows);
      } catch (error) {
        response.status(500).json({ error });
      }
    }
  },
];
