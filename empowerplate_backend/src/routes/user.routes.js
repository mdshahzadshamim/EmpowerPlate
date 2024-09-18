import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
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
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(logInUser);
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/refresh-token").get(verifyJWT, refreshAccessToken);
router.route("/update-details").patch(verifyJWT, updateUserDetails);
router.route("/update-password").post(verifyJWT, updateUserPassword);
router.route("/linked-requests").get(verifyJWT, getAllLinkedRequests);
router.route("/pending-requests").get(verifyJWT, getPendingRequestsByAdmin);
// router.route("/get-chat").post(verifyJWT, getChat)
// router.route("/verify-email").post(verifyEmail)
// router.route("/get-passkey").post(getPasskey)
// router.route("/generate-passkey").post(generateNewPasskey)

export default router;