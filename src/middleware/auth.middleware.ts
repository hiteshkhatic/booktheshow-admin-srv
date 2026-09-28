import type { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

const ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!;

if (!ACCESS_TOKEN) {
    throw new Error('jwt access secret env variable is missing')
}

declare global {
    namespace Express {
        interface Request {
            admin?: { id: string };
        }
    }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "missing or invalid authorization header"})
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new AppError("Invalid token", 400);
    }

    try {
        const payload = jwt.verify(token, ACCESS_TOKEN) as { sub: string};
        req.admin = { id: payload.sub};
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Access token expired'});
        }
        return res.status(401).json({ error: 'INvalid access token'})
    }
}