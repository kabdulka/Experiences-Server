import express from "express";
import { getPostsBySearch, getPosts, createPost, updatePost, deletePost, likePost } from "../controllers/posts";
import auth from "../middleware/auth";

const router = express.Router();

// GET
router.get('/', getPosts);
router.get("/search", getPostsBySearch)

//POST
router.post('/', auth, createPost);

//UPDATE
router.patch('/:id', auth, updatePost);

//DELETE
router.delete('/:id', auth, deletePost);

//Update
router.patch('/:id/like', auth, likePost);

export default router;