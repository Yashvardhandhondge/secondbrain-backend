"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = __importDefault(require("zod"));
const db_1 = require("../models/db");
// import { compare, hash } from "bcrypt-ts";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwt_secret = process.env.JWT_SECRET;
const signupRouter = (0, express_1.Router)();
// Ensure async handler returns Promise<void>
signupRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the validation schema
        const User1 = zod_1.default.object({
            email: zod_1.default.string().email(),
            password: zod_1.default.string().min(4),
            username: zod_1.default.string().min(3),
            image: zod_1.default.string().optional(),
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
        const user = yield db_1.User.create({
            email,
            password, // replace with hashedPassword when ready
            username,
            image,
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, jwt_secret // Optionally set an expiration for the token
        );
        // Send the response
        res.status(201).json({
            token,
            user,
            message: "User Created",
            _id: user._id
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}));
exports.default = signupRouter;
