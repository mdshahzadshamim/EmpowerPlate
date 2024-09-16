import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { config } from "../config/config.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token)
            throw new APIError(401, "Unauthorized request: No access token found");

        const decodedToken = jwt.verify(token, config.accessTokenSecret);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        // const user = await User.findOne({ refreshToken: reauest.cookies?.refreshToken }).select("-password -refreshToken");

        if (!user)
            throw new APIError(401, "Invalid access token");

        req.user = user;
        next();
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid access token");
    }
})