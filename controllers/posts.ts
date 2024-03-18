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

// retrieves posts by page
const getPosts = async (req: Request , res: Response) => {

    const { page } = req.query;
    // console.log("page", page)
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * 8;  // start index of a post on a specific page or start index of every page
        const total = await PostMessage.countDocuments({}) // how many posts do we have
        // console.log("total", total)
        // const result = await PostMessage.deleteMany({});
        // retrieve all messages/posts
        const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex); // get newest post first
        // _id: -1 returns newest post first
        // .limit() limits the number of posts returned
        // skip() skips previous pages

        // console.log(posts)
        res.status(200).json({posts: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {  
        res.status(404).json({ message: error.message });
    }
}

const getPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    // console.log("inside get post")
    // console.log(id)
    try {
        const post = await PostMessage.findById(id);
        // console.log(post);
        // return to the frontend
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
} 

const getPostsBySearch = async (req: Request, res: Response) => {
    try {
        const { searchQuery, tags } = req.query;
        console.log(searchQuery, "Tags:",tags);
        const title = new RegExp(searchQuery?.toString(), "i");
        let posts = await PostMessage.find({$or: [ {title}, {tags: {$in: (tags as string).split(",")}} ]});
        console.log(posts)
        res.json({posts: posts});
       

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
                return res.status(400).json({error: `Missing fields` });
            }
            const newPost = new PostMessage({ ...post, user: req.userId, createdAt: new Date().toISOString()});
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
            { ...updatedPostData, _id },
            // ensure updated document is returned, and validators are run
            { new: true, runValidators: true }
        )
        const allPosts = await PostMessage.find();
        console.log(allPosts.length)
        res.status(202).json(allPosts)

    } catch (error) {
        console.log(error)
    }
}

const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("Inaide delete")
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
    console.log("like post")
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
        // console.log("index", index)
        if (index === -1) {
            // like the post
            post.likes.push(req.userId)
            console.log("Likes", post.likes.length);
        } else {
            // delete like (dislike)
            console.log("Are we here?")
            post.likes = post.likes.filter((id) => id !== (req.userId));
            console.log("Likes", post.likes.length);
            // console.log("newLikes", newLikes)
        }
        
        console.log("Likes", post.likes);

        const updatedPost = await PostMessage.findByIdAndUpdate(
            id,
            post,
            { new: true }
        );
        console.log("new likes", updatePost)
        res.json(updatedPost);

    } catch (error) {
        console.log(error);
    }
}

export {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPostsBySearch,
    // upload,
}
