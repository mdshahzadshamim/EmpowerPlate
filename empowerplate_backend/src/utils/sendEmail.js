import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import { config } from "../config/config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";

const sendEmail = async ({ sendie, emailSubject, emailContent }) => {
    const oAuth2Client = new OAuth2Client(
        config.googleClientId,
        config.googleClientSecret,
        config.googleRedirectURI,
    );
    oAuth2Client.setCredentials({ refresh_token: config.googleOAuth2Ref });

    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: config.gmail,
                clientId: config.googleClientId,
                clientSecret: config.googleClientSecret,
                refreshToken: config.googleOAuth2Ref,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: `EmpowerPlate <${config.gmail}>`,
            to: sendie,
            subject: emailSubject,
            text: emailContent,
        };

        const result = await transport.sendMail(mailOptions);
        if (result.accepted[0] === sendie)
            return true;
        else
            return false;
    } catch (error) {
        throw new APIError(400, "Error sending mail", error);
    }
};

export { sendEmail };