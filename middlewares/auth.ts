import { NextFunction, Request, Response } from "express";
import { ApiResponse } from '../utils/ApiResponse';
import jwt from 'jsonwebtoken';

export const authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.refreshToken
        if(!token) 
            return ApiResponse(res, {
            success: false,
            message: "Unauthorized - at",
            statusCode: 401
        })

        const decoded = await jwt.verify(token, process.env.JWT_SECRET_RF!) as jwt.JwtPayload
        if (req.method === 'GET') {
            (req as any).user = { userId: decoded.userId };
        } else {
            if (!req.body) req.body = {};
            req.body.userId = decoded.userId;
        }
        next()
    } catch (error) {
        console.log(error)
        return ApiResponse(res, {
            success: false,
            message: "Forbidden",
            statusCode: 403
        })
    }
}