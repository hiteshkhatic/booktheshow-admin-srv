import type { NextFunction, Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler.js"
import { login, register, createMovieInCatalog } from "../service/admin.service.js"

export const registerController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin = await register(req.body)
    res.status(201).json({ admin })
  },
)

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin = await login(req.body)
    res.status(200).json({ admin })
  },
)

export const createMovieController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    console.log('movie-controller hiteed')
    
    const adminId = req.admin?.id;

    console.log("2, admin ID:", adminId);

    const movie = await createMovieInCatalog({
        ...req.body,
        createdBy: adminId,
    });

    console.log("3. catalog responded")

    res.status(201).json({
        movie,
    });
  },
)
