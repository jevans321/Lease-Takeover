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

// interface CustomRequest extends Request {
//   user: {
//     // If 'id' is auto-incrementing identifier (common in databases) use 'number' type
//     // If 'id' is unique string, like a UUID or some other form of string-based identifier use string type
//     id: number;
//   };
//   token: string | JwtPayload;
// }

