// bookmarks/bookmarkService.ts
// Handle all business logic related to bookmarks
import { prisma } from '../db/client.ts';

export interface Bookmark {
  userId: number;
  listingId: number;
}

export async function createBookmark(bookmark: Bookmark) {
  const { userId, listingId } = bookmark;
  try {
    const result = await prisma.bookmark.create({
      data: {
        userId,
        listingId,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating bookmark');
  }
}

export async function getBookmarks(userId: number) {
  try {
    const result = await prisma.bookmark.findMany({
      where: {
        userId
      }
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching bookmarks');
  }
}

