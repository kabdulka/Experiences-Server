import express, { Response, Request } from "express";
import PostMessage from "../models/postMessage";
import multer from "multer"
import path from "path";

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
        console.log(posts);

        res.status(200).json(posts);
    } catch (error) {  
        res.status(404).json({ message: error.message });
    }
}

// const createPost = async (req: Request, res: Response) => {

//     // const post = req.body
//     try {
//         const { title, message, user, tags, file } = req.body;
//         // if (req.file) {

//         // }
//         // const selectedFile = req.file.buffer.toString('base64'); 

//         const newPost = new PostMessage({ title, message, user, tags, file });
//         // PostMessage.create({ title, message, user, tags, file });
//         console.log({ title, message, user, tags, file });


//         await newPost.save();
//         res.status(201).json(newPost);
//     } catch (error) {
//         res.status(409);
//     }
// }

const createPost = async (req: Request, res: Response) => {
    try {
        upload(req, res, async (err: any) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }

            const { title, message, user, tags, file } = req.body;
            // const file = req.file;
            // const file = req.file.path;

            const newPost = new PostMessage({ title, message, user, tags, file });

            await newPost.save();
            res.status(201).json(newPost);
        });
    } catch (error) {
        console.error(error);
        res.status(409).json({ message: error.message });
    }
}


export {
    getPosts,
    createPost,
    // upload,
}