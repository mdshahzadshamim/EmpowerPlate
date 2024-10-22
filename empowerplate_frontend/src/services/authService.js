// authService
import axios from "axios";
import config from "../config/config.js";

export const logInUser = async (identifier, password) => {
    try {
        const { type, value } = identifier;

        const response = await axios.post(
            `${config.server}/users/login`,
            { [type]: value, password },
            { withCredentials: true }
        );

        // console.log(response); // Check sampleResponse.txt in more
        if (response.data.success)
            return response.data;
        else
            throw new Error(data.message);

    } catch (error) {
        console.error('Error logging in:', error.response?.data?.message || error.message);
        throw error;
    }
};

export const logOutUser = async () => {
    try {
        const response = await axios.post(
            `${config.server}/users/logout`,
            {},
            { withCredentials: true }
        );

        if (response.data.success)
            return response.data;
        else
            throw new Error(response.data.message);
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const refreshAccessToken = async () => {
    try {
        const response = await axios.get(
            `${config.server}/users/refresh-token`,
            { withCredentials: true }
        )

        if (response.data.success)
            return response.data;
        else
            throw new Error(response.data.message);
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};