import mongoose, { Schema } from "mongoose";

type likesType = {
    type: string[],
    default: string[]
}

interface Post {
    title: string;
    message: string;
    user: string;
    tags: string[];
    file: String
    // likes: likesType
    likes: String[]
    // likeCount: number
    createdAt: Date
}

// create mongoose schema
const postSchema = new Schema<Post>({
    title: String,
    message: String,
    user: String,
    tags: [String],
    file: String,
    likes: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;