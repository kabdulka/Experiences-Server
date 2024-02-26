import express, { Response, Request } from "express";
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken";
import User from "../models/user";
import user from "../models/user";

const SECRET_KEY = process.env.SECRET_KEY;

const signin = async (req: Request, res: Response) => {
    console.log("signin");
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        
        if (!existingUser) {
            return res.status(404).json({message: `User doesn't exist`});
        }

        // check if pass is valid
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({message: `Invalid credentials`})
        }

        // send json web token to frontend
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY, {expiresIn: "1h"});
        res.status(200).json({result: existingUser, token});

    } catch {
        res.status(500).json({messae: `Something went wrong!`});
    }
}

const signup = async (req: Request, res: Response) => {
    console.log("signup");
    const {email, password, firstName, lastName, confirmPassword} = req.body

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({message: "A user with this email already exists!"});
        }

        // compare 2 passwords
        if (password !== confirmPassword) {
            return res.status(400).json({message: `Passwords don't match`});
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 12); // salt = level difficulty

        // create user with hashed password
        const newUser = await user.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`
        });

        // create token
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, SECRET_KEY, {expiresIn: "1h"});

        res.status(200).json({ newUser, token });

    } catch (error) {
        res.status(500).json({messae: `Something went wrong!`});

    }
}

export {
    signin,
    signup,
}

