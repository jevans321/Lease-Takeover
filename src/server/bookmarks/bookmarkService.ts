// bookmarks/bookmarkService.ts
// Handle all business logic related to bookmarks
import { pool } from '../db';
import { prisma } from '../db/client.ts';

export interface Bookmark {
  userId: number;
  listingId: number;
}

export async function createBookmark(bookmark: Bookmark) {
  const { userId, listingId } = bookmark;

  const result = await pool.query(
    'INSERT INTO bookmarks (user_id, listing_id) VALUES ($1, $2)',
    [userId, listingId]
  );

  return result;
}

export async function getBookmarks(user_id: number) {
  const result = await pool.query(
    'SELECT * FROM bookmarks WHERE user_id = $1',
    [user_id]
  );

  return result;
}
