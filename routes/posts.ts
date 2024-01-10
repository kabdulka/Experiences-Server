import express from "express";
import { getPosts, createPost } from "../controllers/posts";

const router = express.Router();

// GET
router.get('/', getPosts);

//POST
router.post('/', createPost)

export default router;