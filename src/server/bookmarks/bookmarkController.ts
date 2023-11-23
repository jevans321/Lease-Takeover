// bookmarks/bookmarkController.ts
// Handle the request/response operations related to bookmarks
import { Request, Response } from 'express';
import { authenticateJWT } from '../middleware/middleware';
import { createBookmark, getBookmarks, Bookmark } from './bookmarkService';
import { validateBookmark } from './bookmarkValidator';
import { CustomRequest } from '../utility/customTypes';

export const handleCreateBookmark = [
  authenticateJWT,
  ...validateBookmark,
  async (request: Request, response: Response) => {
    const token = (request as CustomRequest).token;
    // Assuming `token` is an object with user info on successful authentication
    if (token == null || typeof token !== "object" || !token.user || !token.user.id) {
      return response.status(401).send('Unauthorized access');
    }
    const bookmark: Bookmark = {
      userId: token.user.id, // get user id from the authenticated user
      listingId: request.body.listingId,
    };
    try {
      const result = await createBookmark(bookmark);
      response.status(201).json({
        message: `Bookmark added with ID: ${result.listingId}`,
        listingId: result.listingId
      });
    } catch (error) {
      response.status(500).json({ error: 'Error creating bookmark' });
    }
  },
];

export const handleGetBookmarks = [
  authenticateJWT,
  async (request: Request, response: Response) => {
    const token = (request as CustomRequest).token;
    if (typeof token === 'string') {
      return response.status(401).json({ error: 'Invalid token' });
    }
    const userId = token.user.id;
    try {
      const result = await getBookmarks(userId);
      response.json(result); // 200 status code is default for successful responses
    } catch (error) {
      console.error('Error fetching bookmarks:', error); // Log error for internal diagnostics
      response.status(500).json({ message: 'Error fetching bookmarks' });
    }
  },
];
