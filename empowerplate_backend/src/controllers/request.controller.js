import { Request } from "../models/request.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { options } from "../utils/Options.js";
import mongoose from "mongoose";

// Food Management - To be used within request controllers: respondToRequest, confirmFulfillmentByUser
const addRawFood = async (rawFood) => {};
const subtractRawFood = async (rawFood) => {};
const checkRawFoodAvailability = async (rawFood) => {};
const addCookedFood = async (cookedFood) => {};
const subtractCookedFood = async (cookedFood) => {};
const checkCookedFoodAvailability = async (cookedFood) => {};

const createRequest = asyncHandler(async (req, res) => {
    // if (!((req.user.userType === "RECIPIENT") || (req.user.userType === "DONOR")))
    if (req.user.userType !== "END_USER")
        throw new APIError(405, "User not authorized");

    const requester = req.user._id;
    const { type, foodType, city } = req.body;
    const currentStatus = "PENDING";
    const statusHistory = [];

    statusHistory.push({ status: currentStatus });

    let reqId;

    if (foodType === "RAW") {
        const rawFood = [];

        const food = JSON.parse(req.body.rawFood);

        food.forEach((grain) => {
            rawFood.push({
                grainOrFlourType: grain.grainOrFlourType,
                amountInKg: grain.amountInKg
            })
        })

        const request = await Request.create({
            requester,
            type,
            foodType,
            rawFood,
            city,
            currentStatus,
            statusHistory
        })
        reqId = request._id;
    } else if (foodType === "COOKED") {
        const cookedFood = [];

        const food = JSON.parse(req.body.cookedFood);

        food.forEach((person) => {
            cookedFood.push({
                ageGroup: person.ageGroup,
                count: person.count
            })
        });

        const request = await Request.create({
            requester,
            type,
            foodType,
            cookedFood,
            city,
            currentStatus,
            statusHistory
        })
        reqId = request._id;
    }

    const createdRequest = await Request.findById(reqId);

    if (!createdRequest)
        throw new APIError(401, "Request could not be created");

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                createdRequest,
                "Request created successfully"
            )
        )
});

const respondToRequest = asyncHandler(async (req, res) => {
    // check user type
    // retrieve request from request id
    // add admin id to it
    // accept or reject request status
    // add volunteer id to it
    // update request history
    // update the request in database

    if (req.user.userType !== "ADMIN")
        throw new APIError(405, "User not authorized");

    const { status, volunteerId } = req.body;
    const { request } = req;


    if (!(status === "ACCEPTED" || status === "REJECTED"))
        throw new APIError(400, "Possible operations: Accept/Reject");

    if (!(request.currentStatus === "PENDING"))
        throw new APIError(400, "Invalid scope: Wrong endpoint");

    request.admin = req.user._id;
    request.currentStatus = status;

    if (status === "ACCEPTED")
        request.volunteer = volunteerId;

    request.statusHistory.push({ status: status });

    try {
        await request.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    request,
                    "Request successfully responded"
                )
            )
    } catch (error) {
        throw new APIError(400, "Request wasn't responded");
    }
});

const updateRequestStatus = asyncHandler(async (req, res) => {
    // check user type
    // current status should not be pending, cancelled, or rejected // Note: cancelled already checked earlier
    // if request type = donate, options: ontheway, fulfilled
    //      if current status = accepted, option: ontheway
    //      else if current status = halfway, option: fullfilled 
    // else if request type = receive, options: ontheway
    //      if current status = accepted, option: ontheway
    // update status history
    // update database & respond

    if (!(req.user.userType === "ADMIN" || req.user.userType === "VOLUNTEER"))
        throw new APIError(400, "User not authorized");

    const { request } = req;
    const { status } = req.body;

    if (request.currentStatus === "PENDING" || request.currentStatus === "REJECTED" || request.currentStatus === "CANCELLED")
        throw new APIError(400, "Request is Pending with Admin/Rejected/Cancelled");

    if (request.type === "DONATE") {
        if (request.currentStatus === "ACCEPTED" && status === "ONTHEWAY")
            request.currentStatus = status;
        else if (request.currentStatus === "HALFWAY" && status === "FULLFILLED")
            request.currentStatus = status;
        else
            throw new APIError(400, "This status update is not allowed: Donate");
    } else if (request.type === "RECEIVE") {
        if (request.currentStatus === "ACCEPTED" && status === "ONTHEWAY")
            request.currentStatus = status;
        else
            throw new APIError(400, "This status update is not allowed: Receive");
    } else
        throw new APIError(400, "Invalid request type");

    request.statusHistory.push({ status: status });

    try {
        await request.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    request,
                    "Request successfully updated"
                )
            )
    } catch (error) {
        throw new APIError(400, "Request wasn't updated");
    }
});

const updateRequest = asyncHandler(async (req, res) => {
    const { request } = req;
    if (req.user.type !== "ADMIN")
        throw new APIError(400, "User not authorized: Only admins allowed");

    if (request.foodType === "RAW") {
        const rawFood = [];

        const food = JSON.parse(req.body.rawFood);

        food.forEach((grain) => {
            rawFood.push({
                grainOrFlourType: grain.grainOrFlourType,
                amountInKg: grain.amountInKg
            })
        })

        const updatedRequest = await Request.findByIdAndUpdate(
            request._id,
            {
                $set: {
                    rawFood
                }
            },
            {
                new: true
            }
        )

        if (!updatedRequest)
            throw new APIError(400, "Request couldn't be updated: Raw Food");

        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    {},
                    "Request updated: Raw Food"
                )
            )
    } else if (request.foodType === "COOKED") {
        const cookedFood = [];

        const food = JSON.parse(req.body.cookedFood);

        food.forEach((person) => {
            cookedFood.push({
                ageGroup: person.ageGroup,
                count: person.count
            })
        });

        const updatedRequest = await Request.findByIdAndUpdate(
            request._id,
            {
                $set: {
                    cookedFood
                }
            },
            {
                new: true
            }
        )

        if (!updatedRequest)
            throw new APIError(400, "Request couldn't be updated: Cooked Food");

        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    updatedRequest,
                    "Request updated: Cooked Food"
                )
            )
    } else
        throw new APIError(400, "Request couldn't be updated: Invalid food-type");
});

const cancelRequest = asyncHandler(async (req, res) => {
    const { request, currentStatus, statusHistory } = req.request;
    const { reason, status } = req.body;

    if (req.user.userType === "VOLUNTEER")
        throw new APIError(400, "Volunteers aren't authorized");

    if (!(currentStatus === "ACCEPTED" || request.currentStatus === "ONTHEWAY"))
        throw new APIError(400, "Can't be cancelled");

    currentStatus = status;

    statusHistory.push({ status });

    const cancelledRequest = await Request.findByIdAndUpdate(
        request._id,
        {
            $set: {
                currentStatus, statusHistory, reasonToCancel: reason
            }
        },
        {
            new: true
        }
    )

    if (!cancelledRequest)
        throw new APIError(400, "Request couldn't cancelled: Database update error");

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                cancelledRequest,
                "Request cancelled successfully"
            )
        )
});

const getRequest = asyncHandler(async (req, res) => {
    const { request } = req;

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                request,
                "Request details returned"
            )
        )

});

const confirmFulfillmentByUser = asyncHandler(async (req, res) => {
    if (req.user.userType !== "END_USER")
        throw new APIError(400, "Unautherized user: End-users allowed");

    const { request } = req;
    const { status } = req.body;

    if (request.type === "DONATE" && request.currentStatus === "ONTHEWAY" && status === "HALFWAY")
        request.currentStatus = status;
    else if (request.type === "RECEIVE" && request.currentStatus === "ONTHEWAY" && status === "FULFILLED")
        request.currentStatus = status;
    else
        throw new APIError(400, "Invalid request type");

    request.statusHistory.push({ status: status });

    try {
        await request.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    request,
                    "Request successfully updated"
                )
            )
    } catch (error) {
        throw new APIError(400, "Request wasn't updated");
    }
})

export {
    createRequest,
    respondToRequest,
    updateRequestStatus,
    updateRequest,
    cancelRequest,
    getRequest,
    confirmFulfillmentByUser
}