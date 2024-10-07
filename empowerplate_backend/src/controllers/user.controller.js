import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { options } from "../utils/Options.js";
import { config } from "../config/config.js";
import { Request } from "../models/request.model.js";
import axios from "axios";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../utils/sendEmail.js";


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

const generateOTP = () => {
    const str = "0123456789";
    let num = "";
    for (let i = 0; i < 6; i++) {
        let index = Math.floor(Math.random() * 10);
        num += str[index];
    }
    return num;
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, phone, name, password, userType, city, passkey } = req.body;

    if ([username, email, phone, name, password, userType, city].some((field) => field?.trim() === ""))
        throw new APIError(401, "All fields are required");

    if ((userType === "ADMIN" || userType === "VOLUNTEER") && (passkey !== config.adminPasskey))
        throw new APIError(400, "Incorrect or Invalid passkey");

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
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(
            new APIResponse(
                200,
                {
                    user: createdUser
                },
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
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    // await User.findOneAndUpdate(
    //     {
    //         refreshToken: req.cookies.refreshToken
    //     },
    //     {
    //         $unset: {
    //             refreshToken: 1
    //         }
    //     },
    //     {
    //         new: true
    //     }
    // )

    console.log("User has been logged out");

    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
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
    const userId = req.user._id;

    // Fetch the current user data
    const currentUser = await User.findById(userId).select("username email phone name city");
    if (!currentUser) {
        throw new APIError(404, "User not found");
    }

    const updateFields = {};
    const { username, email, phone, name, city } = req.body;

    if (!(username || email || phone || name || city))
        throw new APIError(401, "Atleast one field is required");

    // Prepare the new values to update only if they are non-empty & different
    if (username && username !== currentUser.username) updateFields.username = username;
    if (email && email !== currentUser.email) updateFields.email = email;
    if (phone && phone !== currentUser.phone) updateFields.phone = phone;
    if (name && name !== currentUser.name) updateFields.name = name;
    if (city && city !== currentUser.city) updateFields.city = city;

    // Function to check for duplicate values for unique fields, excluding current user's ID
    const checkForDuplicates = async (fields) => {
        const duplicateCheck = await User.findOne({
            $or: [
                { username: fields.username, _id: { $ne: userId } },
                { email: fields.email, _id: { $ne: userId } },
                { phone: fields.phone, _id: { $ne: userId } },
            ]
        });

        return !!duplicateCheck; // Returns true if duplicates are found
    };

    // Check for duplicates only if there are fields to update
    const hasDuplicates = Object.keys(updateFields).length > 0 && await checkForDuplicates(updateFields);

    if (hasDuplicates) {
        throw new APIError(400, "Duplicate values found. Update failed.");
    }

    // Proceed with update if no duplicates
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateFields
        },
        {
            new: true
        }
    ).select("-password -refreshToken");


    console.log("User details updated for ", user.username);

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                {
                    user
                },
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
    let cursor;

    if (req.user.userType === "ADMIN") {
        cursor = Request.aggregate([
            {
                $match: {
                    admin: new mongoose.Types.ObjectId(String(req.user._id))
                }
            },
            {
                $project: {
                    statusHistory: 0
                }
            },
            {
                $sort: { createdAt: -1 }  // Sort by latest first
            }
        ]).cursor();
    } else if (req.user.userType === "VOLUNTEER") {
        cursor = Request.aggregate([
            {
                $match: {
                    volunteer: new mongoose.Types.ObjectId(String(req.user._id))
                }
            },
            {
                $project: {
                    statusHistory: 0
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]).cursor();
    } else if (req.user.userType === "END_USER") {
        cursor = Request.aggregate([
            {
                $match: {
                    requester: new mongoose.Types.ObjectId(String(req.user._id))
                }
            },
            {
                $project: {
                    statusHistory: 0
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]).cursor();
    } else {
        throw new APIError(400, "Invalid User");
    }

    // Set the response headers for JSON streaming
    res.setHeader('Content-Type', 'application/json');
    res.write('[');  // Start the JSON array

    let first = true;
    cursor.eachAsync(doc => {
        if (!first) {
            res.write(',');  // Add a comma between documents
        }
        res.write(JSON.stringify(doc));
        first = false;
    })
        .then(() => {
            res.write(']');  // Close the JSON array
            res.end();
        })
        .catch(error => {
            console.error('Error streaming requests:', error);
            res.status(500).json({ error: 'Failed to stream requests' });
        });
});

const getPendingRequestsByAdmin = asyncHandler(async (req, res) => {
    if (req.user.userType !== "ADMIN")
        throw new APIError(400, "Unauthorized User");

    const cursor = Request.aggregate([
        {
            $match: {
                currentStatus: "PENDING"
            }
        },
        {
            $project: {
                statusHistory: 0
            }
        },
        {
            $sort: { createdAt: 1 }  // Sort by oldest first
        }
    ]).cursor();

    // Set the response headers for JSON streaming
    res.setHeader('Content-Type', 'application/json');
    res.write('[');  // Start the JSON array

    let first = true;
    cursor.eachAsync(doc => {
        if (!first) {
            res.write(',');  // Add a comma between documents
        }
        res.write(JSON.stringify(doc));
        first = false;
    })
        .then(() => {
            res.write(']');  // Close the JSON array
            res.end();
        })
        .catch(error => {
            console.error('Error streaming pending requests:', error);
            res.status(500).json({ error: 'Failed to stream pending requests' });
        });
});

const sendCode = asyncHandler(async (req, res) => {
    const { user } = req;
    const code = generateOTP();

    // console.log(user);

    const sendie = user.email;
    const emailSubject = "Email Verification";
    const emailContent = `Your One Time Password is ${code}\n Valid for 10 minutes`;

    // console.log({ sendie, emailSubject, emailContent });
    const emailSent = await sendEmail({ sendie, emailSubject, emailContent });

    if (emailSent) {
        const expiration = new Date(Date.now() + 10 * 60 * 1000);
        const otp = { code, expiration };
        user.otp = otp;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    {},
                    "Verification OTP Sent"
                )
            )
    }
    else
        throw new APIError(400, "Email was not sent");
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const { user } = req;

    if (user.otp.expiration < Date.now()) {
        const unverifiedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $unset: {
                    otp: 1
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
                    {
                        user: unverifiedUser
                    },
                    "OTP Expired"
                )
            )
    } else if (user.otp.expiration >= Date.now() && user.otp.code === code) {
        // user.isVerified = true;
        const verifiedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    isVerified: true
                },
                $unset: {
                    otp: 1
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
                    {
                        user: verifiedUser
                    },
                    "Email successfully verified"
                )
            )
    } else {
        throw new APIError(400, "Problem in verification");
    }
});

// const getChat = asyncHandler(async (req, res) => {})
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
    getPendingRequestsByAdmin,
    sendCode,
    verifyEmail,
    // getChat,
    // getPasskey,
    // generateNewPasskey,
}
