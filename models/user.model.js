import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "User's Name is required"],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "User's Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [true, "User's Password is required"],
        minLength: 8,
    }

},{timestamps: true});

const user = mongoose.model('User', userSchema);

export default user;