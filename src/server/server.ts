import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { handleRegisterUser, handleLoginUser } from './users/userController';
import { handleCreateListing, handleGetListings, handleGetListingById, handleGetListingsBySearchParameters } from './listings/listingController';
import { handleCreateBookmark, handleGetBookmarks } from './bookmarks/bookmarkController';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// Added CORS to to allow requests from frontend domain and port
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// POST requests
app.post('/users/register', handleRegisterUser);
app.post('/users/login', handleLoginUser);
app.post('/listings', handleCreateListing);
app.post('/bookmarks', handleCreateBookmark);

// GET requests
app.get('/bookmarks', handleGetBookmarks);
app.get('/listings', handleGetListings);
app.get('/listings/search', handleGetListingsBySearchParameters);
app.get('/listings/:id', handleGetListingById);

// More routes to be added later...

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});

export default app;