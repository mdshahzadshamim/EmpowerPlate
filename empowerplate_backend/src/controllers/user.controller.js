import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { options } from "../utils/Options.js";
import { config } from "../config/config.js";
import { Request } from "../models/request.model.js";

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

const loggedInUser = async (req) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
        return false;

    const decodedToken = jwt.verify(token, config.accessTokenSecret);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    // const user = await User.findOne({ refreshToken: reauest.cookies?.refreshToken }).select("-password -refreshToken");

    if (!user)
        return false;

    console.log(user.username, " is already logged in");

    return user;
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, phone, name, password, userType, city } = req.body;

    if ([username, phone, email, name, password, userType, city].some((field) => field?.trim() === ""))
        throw new APIError(401, "All fields are required");

    const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });

    if (existingUser)
        throw new APIError(401, "User exists");

    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        phone,
        name,
        password,
        userType,
        city
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser)
        throw new APIError(401, "User creation error");

    console.log(createdUser.username, " registered successfully");

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
    const alreadyLoggedInUser = await loggedInUser(req);
    if (alreadyLoggedInUser) {
        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    {
                        user: alreadyLoggedInUser
                    },
                    "A user is already logged in"
                )
            )
    }

    const { username, email, phone, password } = req.body;

    if (!(username || email || phone))
        throw new APIError(401, "Email/Phone/Username is required");

    const user = await User.findOne({ $or: [{ username }, { email }, { phone }] });

    if (!user)
        throw new APIError(401, "User doesn't exist");

    const passwordIsValid = await user.isPasswordCorrect(password);

    if (!passwordIsValid)
        throw new APIError(401, "Incorrect Password");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    console.log(user.username, " logged in");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new APIResponse(
                200,
                {
                    user: loggedUser
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

    console.log("User has been logged out");

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
    console.log("Current User: ", req.user);

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
    
        console.log("Access token rehreshed");

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new APIResponse(
                    200,
                    {},
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

    console.log("User details");

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

    console.log("Password updated");

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

const getAllLinkedRequests = asyncHandler(async (req, res) => {
    let requests;
    if (req.user.userType === "ADMIN") {
        requests = await Request.aggregate([
            {
                $match: {
                    admin: new mongoose.Types.ObjectId(String(req.user._id))
                }
            },
            {
                $project: {
                    statusHistory: 0
                }
            }
        ])
    } else if (req.user.userType === "VOLUNTEER") {
        requests = await Request.aggregate([
            {
                $match: {
                    volunteer: new mongoose.Types.ObjectId(String(req.user._id))
                }
            },
            {
                $project: {
                    statusHistory: 0
                }
            }
        ])
    } else if (req.user.userType === "END_USER") {
        requests = await Request.aggregate([
            {
                $match: {
                    requester: new mongoose.Types.ObjectId(String(req.user._id))
                }
            },
            {
                $project: {
                    statusHistory: 0
                }
            }
        ])
    } else {
        throw new APIError(400, "Invalid User");
    }

    if (!requests)
        throw new APIError(400, "No related requests");

    console.log("Linked requests returned");

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                requests,
                "Linked requests returned"
            )
        )
})

const getPendingRequestsByAdmin = asyncHandler(async (req, res) => {
    if (req.user.userType !== "ADMIN")
        throw new APIError(400, "Unauthorized User");

    const requests = await Request.aggregate([
        {
            $match: {
                currentStatus: "PENDING"
            }
        },
        {
            $project: {
                statusHistory: 0
            }
        }
    ])

    if (!requests)
        throw new APIError(400, "No pending requests");

    console.log("Pending requests returned");
    
    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                requests,
                "Pending requests returned"
            )
        )
})

// const getChat = asyncHandler(async (req, res) => {})
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
    getAllLinkedRequests,
    getPendingRequestsByAdmin
    // getChat,
    // verifyEmail,
    // getPasskey,
    // generateNewPasskey,
}