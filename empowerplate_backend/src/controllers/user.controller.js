import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { options } from "../utils/Options.js";
import { config } from "../config/config.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user)
            throw new APIError(401, "User not found");

        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const accessToken = user.generateAccessToken();


        return { accessToken, refreshToken };
    } catch (error) {
        throw new APIError(401, "Unable to generate tokens");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, name, password, userType, city } = req.body;

    if ([username, email, name, password, userType, city].some((field) => field?.trim() === ""))
        throw new APIError(401, "All fields are required");

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser)
        throw new APIError(401, "User exists");

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        name,
        password,
        userType,
        city
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser)
        throw new APIError(401, "User creation error");

    // console.log(200, createdUser, "Registered Successfully");

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new APIResponse(
                200,
                createdUser,
                "Registered Successfully"
            )
        )
})

const logInUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!(username || email))
        throw new APIError(401, "Email or Username is required");

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user)
        throw new APIError(401, "User doesn't exist");

    const passwordIsValid = await user.isPasswordCorrect(password);

    if (!passwordIsValid)
        throw new APIError(401, "Incorrect Password");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new APIResponse(
                200,
                {
                    user: loggedUser,
                    accessToken,
                    refreshToken
                },
                "Login Successful"
            )
        )

})

const logOutUser = asyncHandler(async (req, res) => {
    // await User.findByIdAndUpdate(
    //     req.user._id,
    //     {
    //         $unset: {
    //             refreshToken: 1
    //         }
    //     },
    //     {
    //         new: true
    //     }
    // );

    await User.findOneAndUpdate(
        {
            refreshToken: req.cookies.refreshToken
        },
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new APIResponse(
                200,
                {},
                "User Logged Out Successfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                req.user,
                "Success"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken)
        throw new APIError(401, "Unauthorized request: No refresh token found");


    try {
        const decodedToken = jwt.verify(incomingRefreshToken, config.refreshTokenSecret);

        if (Date.now() / 1000 > decodedToken.exp)
            throw new APIError(401, "Refresh token expired, please login again");

        const user = await User.findOne({ refreshToken: incomingRefreshToken });

        if (!user)
            throw new APIError(401, "User not found: Invalid refresh token");

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new APIResponse(
                    200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "Access token refreshed"
                )
            )

    } catch (error) {
        throw new APIError(401, "Could not refresh tokens");
    }
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { username, name, city } = req.body;

    if (!(username || name || city))
        throw new APIError(401, "Atleast one field is required");

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                username, name, city
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                user,
                "User details updated"
            )
        )
})

const updateUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword)
        throw new APIError(401, "Password doesn't match");

    const user = await User.findById(req.user?._id);

    const passwordIsCorrect = await user.isPasswordCorrect(oldPassword);

    if (!passwordIsCorrect)
        throw new APIError(401, "Incorrect old password");

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                {},
                "Password changed"
            )
        )
})

const getAllChats = asyncHandler(async (req, res) => {
    ;
})

const getChat = asyncHandler(async (req, res) => {
    ;
})

// const verifyEmail = asyncHandler(async (req, res) => {})
// const getPasskey = asyncHandler(async (req, res) => {})
// const generateNewPasskey = asyncHandler(async (req, res) => {})

export {
    registerUser,
    logInUser,
    logOutUser,
    getCurrentUser,
    refreshAccessToken,
    updateUserDetails,
    updateUserPassword,
    getAllChats,
    getChat,
    // verifyEmail,
    // getPasskey,
    // generateNewPasskey,
}