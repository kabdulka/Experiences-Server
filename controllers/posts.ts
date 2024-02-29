import express, { Response, Request } from "express";
import PostMessage from "../models/postMessage";
import multer from "multer"
import path from "path";
import mongoose from "mongoose";

interface AuthRequest extends Request {
    userId?: string; // Add the userId property
}

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
// const upload = multer({ storage: storage });
const upload = multer({ storage: storage }).single('file');

const getPosts = async (req: Request , res: Response) => {

    try {
        // const result = await PostMessage.deleteMany({});
        // retrieve all messages/posts
        const posts = await PostMessage.find();
        // console.log(posts);

        res.status(200).json(posts);
    } catch (error) {  
        res.status(404).json({ message: error.message });
    }
}

const createPost = async (req: AuthRequest, res: Response) => {
    try {
        upload(req, res, async (err: any) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }

            // const { title, message, user, tags, file } = req.body;
            const post = req.body;
            console.log(post)
            if ( !post.title || 
                !post.message || !post.file 
                || !post.tags) {
                console.log("here")
                return res.status(400).json({error: `Missing fields` });
            }
            const newPost = new PostMessage({ ...post, user: req.userId, createdAt: new Date().toISOString()});
            console.log("newPost", newPost);
            await newPost.save();
            res.status(201).json(newPost);
        });
    } catch (error) {
        console.error(error);
        res.status(409).json({ message: error.message });
    }
}

const updatePost = async  (req: Request, res: Response) => {
    const { id: _id } = req.params;
    const updatedPostData = req.body
    // const {title, user, message, file, tags} = req.body
    // Error handling code
    // const requiredFields = Object.keys(updatedPostData).map(key => updatedPostData[key]);
    // or 
    // const requiredFields = Object.entries(updatedPostData).map(([key, value]) => value);

    // const missingFields = [];

    // requiredFields.forEach((field) => {
    //     if (!(field in updatedPostData)) {
    //         console.log(field in updatedPostData);
    //         missingFields.push(field);
    //     }
    // })
    // // at least 1 field is missing from req.body
    // if (missingFields.length > 0) {
    //     console.log(missingFields)
    //     return res.status(400).json({error: `Missing fields: ${missingFields.join(', ')}`});
    // }
    
    if ( !updatedPostData.title || 
        !updatedPostData.message || !updatedPostData.file 
        || !updatedPostData.tags) {
        console.log("here")
        return res.status(400).json({error: `Missing fields` });
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("Could not find a post with that ID");
    }

    // find post/experience
    try {
        const updatedPost = await PostMessage.findByIdAndUpdate (
            _id,
            // spread update data and include the ID. Fixed previous bug when id was not included
            {...updatedPostData, _id},
            // ensure updated document is returned, and validators are run
            {new: true, runValidators: true}
        )

        res.status(202).json(updatedPost)

    } catch (error) {
        console.log(error)
    }
}

const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("No post with that Id");
        }
        await PostMessage.findByIdAndDelete(id);
        res.json({ message: `Post Deleted` });
    } catch (error) {
        console.log(error)
    }
}

const likePost = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // check if user is authenticated
    if (!req.userId) {
        return res.json({ message: "User is not authenticated" });
    }

    try {
        // check if the post the user wants to like is there
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("No post with that Id");
        }

        const post = await PostMessage.findById(id);

        const index = post.likes.findIndex((id) => id === String(req.userId));
        console.log("index", index)
        if (index === -1) {
            // like the post
            post.likes.push(req.userId)
        } else {
            // delete like (dislike)
            post.likes = post.likes.filter((id) => 
               
                id !== (req.userId)
            );
            // console.log("newLikes", newLikes)
            console.log(post.likes);
        }

        const updatedPost = await PostMessage.findByIdAndUpdate(
            id,
            post,
            { new: true }
        );
        res.json(updatedPost);

    } catch (error) {
        console.log(error);
    }
}

export {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    // upload,
}
