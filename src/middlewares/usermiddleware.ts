import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const Jwt_scerate = process.env.JWT_SECRET;

interface CustomRequest extends Request {
    userId?: string; 
}

export default function usermiddleware(req: CustomRequest, res: Response, next: NextFunction): void {
    const token = req.headers.token || "";

    if (!token) {
         res.status(401).json({
            message: "No token provided"
        });
    }

    try {
       
        const decoded = jwt.verify(token.toString(), Jwt_scerate || "") as jwt.JwtPayload;

     
        if (decoded && decoded.id) {
            req.userId = decoded.id; 
            next();
          
        } else {
             res.status(401).json({
                message: "Unauthorized"
            });
        }
    } catch (e) {
         res.status(403).json({
            message: "Invalid token"
        });
    }
}

