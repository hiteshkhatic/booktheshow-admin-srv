import { createAdmin, findAdminByUsername, storeRefreshToken } from "../repository/admin.repository.js";
import { AppError } from "../utils/AppError.js";
import bcrypt from 'bcrypt';
import type { CreateMovieInput, CreateMovieWithAdmin, RegisterInput } from "../validation/admin.vaidation.js";
import { toAdminResponseDTO } from "../dto/admin.dto.js";
import jwt from 'jsonwebtoken';
import { signRefreshToken } from "../utils/refreshToken.js";
import crypto from 'node:crypto'

export const register = async (input: RegisterInput) => {
    const existing = await findAdminByUsername(input.username)

    if (existing) {
        throw new AppError('Username already exits', 409)
    }

    const password_hash = await bcrypt.hash(input.password, 10)
    const admin = await createAdmin({ ...input, password_hash})

    return toAdminResponseDTO(admin);
}

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export const login = async (input: RegisterInput) => {
    const admin= await findAdminByUsername(input.username)
    if (!admin) {
        throw new AppError("Invalid username", 404);
    }

    const valid = await bcrypt.compare(input.password, admin.passwordHash);
    if (!valid) throw new AppError("Invalid email or password", 401)

    const secret = process.env.JWT_ACCESS_SECRET;
    if(!secret) {
        throw new AppError("no token in .env", 404)
    }

    const accessToken = jwt.sign(
        { 
            sub: admin.id,
            role: "admin",
        }, 
        secret,
        {expiresIn: "15m",})

    const refreshToken = signRefreshToken(admin.id)

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await storeRefreshToken(admin.id, hashToken(refreshToken), expiresAt)
    return { admin: toAdminResponseDTO(admin), accessToken, refreshToken}
}

export const createMovieInCatalog = async(data: CreateMovieWithAdmin) => {
    console.log('4 movie-service heated')
    console.log("URL:", process.env.CATALOG_SERVICE_URL);
    const response = await fetch(
        `${process.env.CATALOG_SERVICE_URL}/internal/movies`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-internal-service-secret":
                    process.env.INTERNAL_SERVICE_SECRET!,
            },
            body: JSON.stringify(data),
        }
    );

    console.log("5. catalog response", response.status);

    if (!response.ok) {
        throw new AppError(
            'Failed to create movie in catalog service', response.status
        );
    }

    return response.json();
}