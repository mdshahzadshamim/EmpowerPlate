import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { APIError } from "../utils/APIError.js";
import { config } from "../config/config.js";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    userType: {
        type: String,
        enum: [
            "ADMIN",
            "VOLUNTEER",
            "END_USER", // RECIPIENT, DONOR
        ],
        required: true,
        default: "END_USER"
    },
    city: {
        type: String,
        enum: [
            config.currentCity,
        ],
        default: config.currentCity
    },
    chats: {
        type: [],
        default: undefined
    },
    requests: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Request",
            }
        ],
        default: undefined
    },
    refreshToken: {
        type: String,
        index: true
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    try {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                username: this.username,
                fullname: this.fullname
            },
            config.accessTokenSecret,
            {
                expiresIn: config.accessTokenExpiry
            }
        )
    } catch (error) {
        throw new APIError(501, "Unable to generate access token");
    }
};

userSchema.methods.generateRefreshToken = function () {
    try {
        return jwt.sign(
            {
                // _id: this._id
                date: Date.now()
            },
            config.refreshTokenSecret,
            {
                expiresIn: config.refreshTokenExpiry
            }
        )
    } catch (error) {
        throw new APIError(502, "Unable to generate refresh token")
    }
};

export const User = mongoose.model("User", userSchema);