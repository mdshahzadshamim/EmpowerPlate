import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request } from "../models/request.model.js";

export const verifyRequest = asyncHandler(async (req, _, next) => {
    try {
        const { requestId } = req.body;

        const request = await Request.findById(requestId);

        if (!request)
            throw new APIError(400, "Request not found");

        if (request.currentStatus === "CANCELLED" || request.currentStatus === "REJECTED")
            throw new APIError(400, "Cancelled/Rejected Request");

        if (request.city !== user.city)
            throw new APIError(400, "Location mismatch");

        req.request = request;
        next();
    } catch (error) {
        throw new APIError(400, "Invalid Request");
    }
})