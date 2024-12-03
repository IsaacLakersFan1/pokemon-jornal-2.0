// src/types.d.ts

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number; // The type of `userId` that you'll get from the JWT payload
      };
    }
  }
}
