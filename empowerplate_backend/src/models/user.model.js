import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { APIError } from "../utils/APIError.js";
import { config } from "../config/config.js";
import { regEx } from "../../constantsConfig.js";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        validate: {
            validator: function (v) {
                return regEx.username.test(v);
            },
            message: props => `${props.value} is not a valid username!`
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
        validate: {
            validator: function (v) {
                return regEx.email.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        },
        default: undefined
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
        validate: {
            validator: function (v) {
                return regEx.phone.test(v);
            },
            message: props => `${props.value} is not a valid Indian phone number!`
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        validate: {
            validator: function (v) {
                return regEx.name.test(v);
            },
            message: props => `${props.value} is not a valid name!`
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        maxlength: 20,
        validate: {
            validator: function (v) {
                return regEx.password.test(v);
            },
            message: props => `${props.value} is not a valid password!`
        }
    },
    userType: {
        type: String,
        enum: [
            "ADMIN",
            "VOLUNTEER",
            "END_USER", // RECIPIENT, DONOR
        ],
        default: "END_USER"
    },
    city: {
        type: String,
        enum: [
            config.currentCity,
        ],
        uppercase: true,
        default: config.currentCity
    },
    chats: {
        type: [],
        default: undefined
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        code: {
            type: String,
        },
        expiration: {
            type: Date
        }
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
        type: String
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
                phone: this.phone,
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