import jwt, { Jwt } from "jsonwebtoken";
import express, {Response, Request, NextFunction} from "express"

interface AuthRequest extends Request {
    userId?: string; // Add the userId property
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // console.log("inside auth middleware");
        // check if user is who they're claiming to be
        // check if token is valid

        // get token from frontend
        const token = req.headers?.authorization.split(" ")[1]; // token is index 1 in array
       
        // check which token this is, i.e. our token or google auth's token
        const isGoogleToken = token.length < 10;
        // console.log(token.length)
        let decodedData; // data we want from the token
        
        if (token && isGoogleToken) {
            console.log("google backend auth")
            decodedData = jwt.decode(token) // gives us data from each token
            console.log(decodedData?.sub)
            req.userId = decodedData?.sub; // sub is google's name for a specific id that differentiates every google user
        } else {
            decodedData = jwt.verify(token, process.env.SECRET_KEY);
            req.userId = decodedData?.id;
        }

        next();

    } catch (error) {
        res.status(500).json({ message: "Authentication failed" });

    }
};

export default auth;