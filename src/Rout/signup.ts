import { Request, Response, Router } from "express";
import Zod from 'zod';
import { User } from "../models/db";
// import { compare, hash } from "bcrypt-ts";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwt_secret = process.env.JWT_SECRET as string;



const signupRouter = Router();

// Ensure async handler returns Promise<void>
signupRouter.post("/signup", async (req: Request, res: Response): Promise<void> => {
    try {
        // Define the validation schema
        const User1 = Zod.object({
            email: Zod.string().email(),
            password: Zod.string().min(4),
            username: Zod.string().min(3),
            image: Zod.string().optional(),
        });

        // Validate the incoming request body
        const SafeParse = User1.safeParse(req.body);

        // If validation fails, send a 400 response and return
        if (!SafeParse.success) {
            res.status(400).json({
                message: "Validation failed",
                error: SafeParse.error,
            });
            return;
        }

        const { email, password, username, image } = SafeParse.data;

        // Uncomment if you are using password hashing
        // const hashedPassword = await hash(password, 5);

        // Create the user in the database
        const user = await User.create({
            email,
            password, // replace with hashedPassword when ready
            username,
            image,
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            jwt_secret // Optionally set an expiration for the token
        );

        // Send the response
        res.status(201).json({
            token,
            user,
            message: "User Created",
            _id : user._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

export default signupRouter;
