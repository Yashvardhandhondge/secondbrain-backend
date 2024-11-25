import { Response,Request } from "express";
import { Router } from "express";
import Zod from 'zod'
import { User } from "../models/db";
// import { compare, hash } from "bcrypt-ts";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const Jwt_scerate = process.env.JWT_SECRET;

const SigninRouter = Router();

SigninRouter.post("/signin", async (req:Request,res : Response) => {
    try{
    const User1 = Zod.object({
        email : Zod.string().email(),
        password : Zod.string().min(4)
    })
    
   

    const SafeParse = User1.safeParse(req.body);

    if(!SafeParse.success){
        res.status(400).json({
            message : " Something is wrong",
            error : SafeParse.error
        })
    }

    const {email , password} = req.body;
    
    // const hashedPassword = await hash(password,5);

    const user = await User.findOne({
        email,
        password  
    })

    if (user) {
        const token = jwt.sign({
            id: user._id
        }, Jwt_scerate || "")
        
        res.status(201).json({
            token,
            user,
            message: "User has logged in"
        })
    } else {
        res.status(400).json({
            message: "User not found"
        })
    }
    
   
    } catch(error) {
        console.error(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
    
})

export default SigninRouter;