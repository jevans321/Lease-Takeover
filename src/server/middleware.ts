import jwt, { VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { CustomJwtPayload, CustomRequest } from './customTypes';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

enum HttpStatus {
  Unauthorized = 401,
  Forbidden = 403,
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  // eg. authHeader = 'Bearer eyJhbiXVCJ9.eyJ1c2VyjpNTUwfQ.79G1EHkoHd_rF2ZcbKNrwo'
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    // eg. token = 'eyJhbiXVCJ9.eyJ1c2VyjpNTUwfQ.79G1EHkoHd_rF2ZcbKNrwo'

    jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null, payload) => {
      if (err || payload === undefined) {
        return res.sendStatus(HttpStatus.Forbidden);
      }
      // add user payload to request
      (req as CustomRequest).token = payload as CustomJwtPayload;
      next();
    });

    // try {
    //   const decoded = jwt.verify(token, JWT_SECRET);
    //   (req as CustomRequest).token = decoded;

    //   next();
    // } catch (e) {
    //   return res.sendStatus(HttpStatus.Forbidden);
    // }
  } else {
    res.sendStatus(HttpStatus.Unauthorized);
  }
};

export {
  authenticateJWT,
};