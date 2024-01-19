import express from "express";
import { getPosts, createPost, updatePost, deletePost } from "../controllers/posts";

const router = express.Router();

// GET
router.get('/', getPosts);

//POST
router.post('/', createPost)

//UPDATE
router.patch('/:id', updatePost);

//DELETE
router.delete('/:id', deletePost);
export default router;