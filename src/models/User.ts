import { time } from "console";
import { create } from "domain";

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: Date,
    updatedAt: Date,
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);

export default User;