import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  user: {
    // If 'id' is auto-incrementing identifier (common in databases) use 'number' type
    // If 'id' is unique string, like a UUID or some other form of string-based identifier use string type
    id: number;
  };
}

export interface CustomRequest extends Request {
  token: string | CustomJwtPayload;
}

export interface Listing {
  id?: number;
  amenities: string[];
  authorId: number;
  bathrooms?: number;
  bedrooms?: number;
  city?: string;
  createdAt?: Date;
  description?: string;
  furnished: boolean;
  imageUrl?: string;
  leaseEnd?: Date;
  leaseStart?: Date;
  leaseType?: string;
  location?: string;
  matches?: Match[];
  petFriendly: boolean;
  propertyType?: string;
  published: boolean;
  rent: number;
  state?: string;
  title?: string;
  updatedAt?: Date;
  utilitiesIncluded: boolean;
  zipCode?: string;
}

export interface Match {
  id: number;
  listingId: number;
  userId: number;
  createdAt: Date;
  status: string; // You can also use a more specific type like 'pending' | 'accepted' | 'declined' if you have a fixed set of statuses
}


// interface CustomRequest extends Request {
//   user: {
//     // If 'id' is auto-incrementing identifier (common in databases) use 'number' type
//     // If 'id' is unique string, like a UUID or some other form of string-based identifier use string type
//     id: number;
//   };
//   token: string | JwtPayload;
// }

