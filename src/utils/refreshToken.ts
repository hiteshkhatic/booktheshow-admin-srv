import { AppError } from "./AppError.js";
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

export const signRefreshToken = (adminId: string) : string => {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
        throw new AppError("jwt refresh secret is not defined", 404)
    }

    return jwt.sign(
        { sub: adminId, jti: crypto.randomUUID() },
        secret,
        { expiresIn: '7d'}
    );
}
