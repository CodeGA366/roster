// express.d.ts
import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number; // Adjust the type based on your user ID type
                // Add other properties from your user object if needed
            };
        }
    }
}