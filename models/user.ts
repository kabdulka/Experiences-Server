import mongoose, { Schema } from "mongoose";

interface User {
    id: string
    name: string
    email: string
    password: string
    // confirmPassword: string
}

const userSchema = new Schema<User> ({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: String },
})

// specify schema on which the model is built on
export default mongoose.model("User", userSchema);