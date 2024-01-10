import mongoose, { Schema } from "mongoose";

interface User {
    title: string;
    message: string;
    user: string;
    tags: string[];
    selectedFile: string
    likeCount: number
    createdAt: Date
}

// create mongoose schema
const postSchema = new Schema<User>({
    title: String,
    message: String,
    user: String,
    tags: [String],
    selectedFile: String,
    likeCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;