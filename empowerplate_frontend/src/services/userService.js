import axios from "axios";
import config from "../config/config";

export const registerUser = async (username, email, phone, name, password, userType, city) => {
    try {
        const response = await axios.post(
            `${config.server}/users/register`,
            { username, email, phone, name, password, userType, city },
            { withCredentials: true }
        );

        if (response.data.success)
            return response.data;
        else
            throw new Error(data.message);
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axios.get(
            `${config.server}/users/current-user`,
            {},
            { withCredentials: true }
        );

        if (response.data.success)
            return response.data;
        else
            throw new Error(data.message);
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const updateUserDetails = async (username, name, city) => {
    try {
        const response = await axios.patch(
            `${config.server}/users/update-details`,
            { username, name, city },
            { withCredentials: true }
        );

        if (response.data.success)
            return response.data;
        else
            throw new Error(data.message);
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const updateUserPassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
        const response = await axios.post(
            `${config.server}/users/update-password`,
            { oldPassword, newPassword, confirmPassword },
            { withCredentials: true }
        );

        if (response.data.success)
            return response.data;
        else
            throw new Error(data.message);
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const getAllLinkedRequests = async () => {
    try {
        const response = await axios.get(
            `${config.server}/users/linked-requests`,
            {},
            { withCredentials: true }
        );

        if (response.data.success)
            return response.data;
        else
            throw new Error(data.message);
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const getPendingRequestsByAdmin = async () => {
    try {
        const response = await axios.get(
            `${config.server}/users/pending-requests`,
            {},
            { withCredentials: true }
        );

        if (response.data.success)
            return response.data;
        else
            throw new Error(data.message);
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const sendCode = async () => {
    try {
        const response = await axios.post(
            `${config.server}/users/send-code`,
            {},
            { withCredentials: true }
        );

        if (response.data.success)
            return response.data;
        else
            throw new Error(data.message);
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const verifyEmail = async (code) => {
    try {
        const response = await axios.post(
            `${config.server}/users/verify-email`,
            { code },
            { withCredentials: true }
        );

        if (response.data.success)
            return response.data;
        else
            throw new Error(data.message);
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

