import express, { Response, Request } from "express";
import PostMessage from "../models/postMessage";


const getPosts = async (req: Request , res: Response) => {
    
    try {
        // retrieve all messages/posts
        const posts = await PostMessage.find();
        console.log(posts);

        res.status(200).json(posts);
    } catch (error) {  
        res.status(404).json({ message: error.message });
    }
}

const createPost = async (req: Request, res: Response) => {

    const post = req.body

    const newPost = new PostMessage(post);

    try {

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409);
    }
}

export {
    getPosts,
    createPost,
}