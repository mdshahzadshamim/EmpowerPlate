import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRequest } from "../middlewares/req.middleware.js";
import {
    createRequest,
    respondToRequest,
    updateRequestStatus,
    updateRequest,
    cancelRequest,
    getRequest,
    confirmFulfillmentByUser
} from "../controllers/request.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createRequest);
router.route("/respond").post(verifyJWT, verifyRequest, respondToRequest);
router.route("/update-status").post(verifyJWT, verifyRequest, updateRequestStatus);
router.route("/update-request").post(verifyJWT, verifyRequest, updateRequest);
router.route("/cancel-request").post(verifyJWT, verifyRequest, cancelRequest);
router.route("/get-request").post(verifyJWT, verifyRequest, getRequest);
router.route("/fulfill-request").post(verifyJWT, verifyRequest, confirmFulfillmentByUser);
router.route("/fulfill-request").post(verifyJWT, verifyRequest, confirmFulfillmentByUser);

export default router;
