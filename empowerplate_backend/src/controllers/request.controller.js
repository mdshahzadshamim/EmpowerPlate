import { Request } from "../models/request.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { options } from "../utils/Options.js";
import mongoose from "mongoose";
import pool from "../db/postgresConnection.js";

// Food Management - To be used within request controllers: respondToRequest, confirmFulfillmentByUser
const addRawFood = async (rawFood) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start transaction

        let updatedCount = 0;

        for (const grain of rawFood) {
            const { amountInKg, grainOrFlourType } = grain;

            const result = await client.query(
                `UPDATE rawFood SET amountInKg = amountInKg + $1 WHERE grainOrFlourType = $2`,
                [amountInKg, grainOrFlourType]
            );

            if (result.rowCount > 0) {
                updatedCount++;
            }
        }

        // If all entries were updated, commit the transaction
        if (updatedCount === rawFood.length) {
            await client.query('COMMIT');
            console.log("addRawFood: ", true, updatedCount);
            return true;
        } else {
            // Rollback the transaction if not all entries were updated
            await client.query('ROLLBACK');
            console.log("addRawFood: ", false, transaction);
            return false;
        }
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback the transaction in case of an error
        console.error('Error adding raw food: ', error);
        throw error;
    } finally {
        client.release(); // Release the client back to the pool
    }
};

const subtractRawFood = async (rawFood) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start transaction

        let updatedCount = 0;

        for (const grain of rawFood) {
            const { amountInKg, grainOrFlourType } = grain;

            const result = await client.query(
                `UPDATE rawFood SET amountInKg = amountInKg - $1 WHERE grainOrFlourType = $2`,
                [amountInKg, grainOrFlourType]
            );

            if (result.rowCount > 0) {
                updatedCount++;
            }
        }

        // If all entries were updated, commit the transaction
        if (updatedCount === rawFood.length) {
            await client.query('COMMIT');
            console.log("subtractRawFood: ", true, updatedCount);
            return true;
        } else {
            // Rollback the transaction if not all entries were updated
            await client.query('ROLLBACK');
            console.log("subtractRawFood: ", false, updatedCount);
            return false;
        }
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback the transaction in case of an error
        console.error('Error subtracting raw food: ', error);
        throw error;
    } finally {
        client.release(); // Release the client back to the pool
    }
};

const checkRawFoodAvailability = async (rawFood) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start transaction

        for (const grain of rawFood) {
            const { grainOrFlourType, amountInKg } = grain;

            const result = await client.query(
                `SELECT amountInKg FROM rawFood WHERE grainOrFlourType = $1`,
                [grainOrFlourType]
            );

            if (result.rows.length === 0) {
                await client.query('ROLLBACK'); // Rollback the transaction if any item is not found
                return false;
            }

            const availableAmount = parseFloat(result.rows[0].amountInKg);
            if (availableAmount < amountInKg) {
                await client.query('ROLLBACK'); // Rollback if not enough amount is available
                console.log("checkRawFoodAvailability: ", false, availableAmount);
                return false;
            }
        }

        await client.query('COMMIT'); // Commit the transaction if all checks pass
        console.log("checkRawFoodAvailability: ", true);
        return true;
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback in case of an error
        console.error('Error checking raw food availability: ', error);
        throw error;
    } finally {
        client.release(); // Release the client back to the pool
    }
};

const addCookedFood = async (cookedFood) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let updatedCount = 0;

        for (const food of cookedFood) {
            const { ageGroup, count } = food;

            const result = await client.query(
                `UPDATE cookedFood SET count = count + $1 WHERE ageGroup = $2`,
                [count, ageGroup]
            );

            if (result.rowCount > 0) {
                updatedCount++;
            }
        }

        if (updatedCount === cookedFood.length) {
            await client.query('COMMIT');
            console.log("addCookedFood: ", true, updatedCount);
            return true;
        } else {
            await client.query('ROLLBACK');
            console.log("addCookedFood: ", false, updatedCount);
            return false;
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding cooked food: ', error);
        throw error;
    } finally {
        client.release();
    }
};

const subtractCookedFood = async (cookedFood) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let updatedCount = 0;

        for (const food of cookedFood) {
            const { ageGroup, count } = food;

            const result = await client.query(
                `UPDATE cookedFood SET count = count - $1 WHERE ageGroup = $2`,
                [count, ageGroup]
            );

            if (result.rowCount > 0) {
                updatedCount++;
            }
        }

        if (updatedCount === cookedFood.length) {
            await client.query('COMMIT');
            console.log("subtractCookedFood: ", true, updatedCount);
            return true;
        } else {
            await client.query('ROLLBACK');
            console.log("subtractCookedFood: ", false, updatedCount);
            return false;
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error subtracting cooked food: ', error);
        throw error;
    } finally {
        client.release();
    }
};

const checkCookedFoodAvailability = async (cookedFood) => {
    const client = await pool.connect();

    console.log(cookedFood);

    try {
        await client.query('BEGIN'); // Start transaction

        for (const people of cookedFood) {
            const { ageGroup, count } = people;

            const result = await client.query(
                `SELECT count FROM cookedFood WHERE ageGroup = $1`,
                [ageGroup]
            );

            if (result.rows.length === 0) {
                await client.query('ROLLBACK'); // Rollback the transaction if any item is not found
                return false;
            }

            const availableCount = parseFloat(result.rows[0].count);
            if (availableCount < count) {
                await client.query('ROLLBACK'); // Rollback if not enough count is available
                console.log("checkCookedFoodAvailability: ", false, availableCount);
                return false;
            }
        }

        await client.query('COMMIT'); // Commit the transaction if all checks pass
        console.log("checkCookedFoodAvailability: ", true);
        return true;
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback in case of an error
        console.error('Error checking cooked food availability: ', error);
        throw error;
    } finally {
        client.release(); // Release the client back to the pool
    }
};


const createRequest = asyncHandler(async (req, res) => {
    // if (!((req.user.userType === "RECIPIENT") || (req.user.userType === "DONOR")))
    // console.log(req.body);
    if (req.user.userType !== "END_USER")
        throw new APIError(405, "User not authorized");

    const requester = req.user._id;
    const city = req.user.city;
    const { type, foodType } = req.body;
    const currentStatus = "PENDING";
    const statusHistory = [];

    statusHistory.push({ status: currentStatus });

    let reqId;

    if (foodType === "RAW") {
        const rawFood = [];

        let food = req.body.rawFood;
        if (food === undefined) {
            food = JSON.parse(req.body.rawFood);
        }

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

        let food = req.body.cookedFood;
        if (food === undefined) {
            food = JSON.parse(req.body.cookedFood);
        }

        food.forEach((people) => {
            cookedFood.push({
                ageGroup: people.ageGroup,
                count: people.count
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

    console.log("Request created successfully");

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                {
                    request: createdRequest
                },
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

    if (request.type === "RECEIVE") { // This condition keeps the admin-errors in check, by running food availability check
        let foodAvailable;

        if (request.foodType === "RAW") {
            foodAvailable = await checkRawFoodAvailability(request.rawFood);
        } else if (request.foodType === "COOKED") {
            foodAvailable = await checkCookedFoodAvailability(request.cookedFood);
        } else {
            throw new APIError(400, "Improper request");
        }

        if (!foodAvailable) {
            console.log("Enough or appropriate food is not available");

            return res
                .status(250)
                .json(
                    new APIResponse(
                        405,
                        {},
                        "Enough or appropriate food is not available"
                    )
                )
        }
    }

    request.admin = req.user._id;
    request.currentStatus = status;

    if (status === "ACCEPTED")
        request.volunteer = volunteerId;

    request.statusHistory.push({ status: status });

    try {
        if (request.type === "RECEIVE" && status === "ACCEPTED") { // Receive-requests are getting accepted by admin, updating food-bank
            let transaction;

            if (request.foodType === "RAW") {
                transaction = await subtractRawFood(request.rawFood);
            } else if (request.foodType === "COOKED") {
                transaction = await subtractCookedFood(request.cookedFood);
            } else {
                throw new APIError(400, "Improper request");
            }

            if (!transaction)
                throw new APIError(400, "Database update error");
        }

        await request.save({ validateBeforeSave: false });

        console.log("Request successfully responded");

        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    {
                        request
                    },
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
    //      else if current status = halfway, option: fulfilled 
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
        if (request.currentStatus === "ACCEPTED" && status === "ONTHEWAY") {
            request.currentStatus = status;
        } else if (request.currentStatus === "HALFWAY" && status === "FULFILLED" && req.user.userType === "ADMIN") {
            let transaction;

            if (request.foodType === "RAW")
                transaction = await addRawFood(request.rawFood);
            else if (request.foodType === "COOKED")
                transaction = await addCookedFood(request.cookedFood);

            if (!transaction)
                throw new APIError(400, "Database update error");

            request.currentStatus = status; // Donate-requests are getting fulfillment confirmation by admin, updating food-bank
        } else
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

        console.log("Request status updated successfully");

        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    {
                        request
                    },
                    "Request status updated successfully"
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

        console.log("Request updated: Raw Food");

        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    {
                        request: updatedRequest
                    },
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

        console.log("Request updated: Cooked Food");

        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    {
                        request: updatedRequest
                    },
                    "Request updated: Cooked Food"
                )
            )
    } else
        throw new APIError(400, "Request couldn't be updated: Invalid food-type");
});

const cancelRequest = asyncHandler(async (req, res) => {
    const { request } = req;
    const { reason } = req.body;
    const status = "CANCELLED";

    // if (!status === "CANCELLED")
    //     throw new APIError(400, `Invalid update specification: ${status}`);
    if (!reason)
        reason = "Cancelled without any reason";

    if (req.user.userType === "VOLUNTEER")
        throw new APIError(400, "Volunteers aren't authorized");

    if (!(request.currentStatus === "ACCEPTED" || request.currentStatus === "ONTHEWAY"))
        throw new APIError(400, "Can't be cancelled");

    request.currentStatus = status;

    request.statusHistory.push({ status });

    const cancelledRequest = await Request.findByIdAndUpdate(
        request._id,
        {
            $set: {
                currentStatus: request.currentStatus,
                statusHistory: request.statusHistory,
                reasonToCancel: reason
            }
        },
        {
            new: true
        }
    )

    if (!cancelledRequest)
        throw new APIError(400, "Request couldn't cancelled: Database update error");

    let transaction = 0; // For adding back the rerturned food into database

    if (request.type === "RECEIVE") {
        if (request.foodType === "RAW") {
            transaction = await addRawFood(request.rawFood);
        } else if (request.foodType === "COOKED") {
            transaction = await addCookedFood(request.cookedFood);
        }
        else {
            throw new APIError(400, "Invalid cancel request");
        }
    }

    if (!transaction)
        throw new APIError(400, "Database couldn't be updated");

    console.log("Request cancelled successfully");

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                {
                    request: cancelledRequest
                },
                "Request cancelled successfully"
            )
        )
});

const getRequest = asyncHandler(async (req, res) => {
    const { request } = req;

    console.log("Request details returned");

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                {
                    request
                },
                "Request details returned"
            )
        )

});

const confirmFulfillmentByUser = asyncHandler(async (req, res) => {
    if (req.user.userType !== "END_USER")
        throw new APIError(400, "Unautherized user: End-users allowed");

    const { request } = req;
    const { status } = req.body;

    if (request.type === "DONATE" && request.currentStatus === "ONTHEWAY" && status === "HALFWAY") {
        request.currentStatus = status;
    } else if (request.type === "RECEIVE" && request.currentStatus === "ONTHEWAY" && status === "FULFILLED") {
        request.currentStatus = status;
    } else
        throw new APIError(400, "Invalid request type");

    request.statusHistory.push({ status: status });

    try {
        await request.save({ validateBeforeSave: false });

        console.log("Request successfully updated");

        return res
            .status(200)
            .json(
                new APIResponse(
                    200,
                    {
                        request
                    },
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