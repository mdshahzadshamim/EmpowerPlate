import axios from "axios";
import config from "../config/config";

export const createRequest = async (type, foodType, newFood) => {
    try {
        let rawFood = [], cookedFood = [];
        if (foodType === "RAW") {
            rawFood = newFood;
            // console.log(rawFood);
            // console.log(newFood);
            const response = await axios.post(
                `${config.server}/requests/create`,
                { type, foodType, rawFood },
                { withCredentials: true }
            );

            if (response.data.success)
                return response.data;
            else
                throw new Error(data.message);
        } else if (foodType === "COOKED") {
            cookedFood = newFood;
            const response = await axios.post(
                `${config.server}/requests/create`,
                { type, foodType, cookedFood },
                { withCredentials: true }
            );

            if (response.data.success)
                return response.data;
            else
                throw new Error(data.message);
        }
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const respondToRequest = async (requestId, volunteerId, status) => {
    try {
        const response = await axios.post(
            `${config.server}/requests/respond`,
            { requestId, volunteerId, status },
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

export const updateRequestStatus = async (requestId, status) => {
    try {
        const response = await axios.post(
            `${config.server}/requests/update-status`,
            { requestId, status },
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
export const updateRequest = async (requestId, foodType, food) => {
    try {
        if (foodType === "RAW") {
            const rawFood = food;
            const response = await axios.post(
                `${config.server}/requests/update-request`,
                { requestId, foodType, rawFood },
                { withCredentials: true }
            );

            if (response.data.success)
                return response.data;
            else
                throw new Error(data.message);
        } else if (foodType === "COOKED") {
            const cookedFood = food;
            const response = await axios.post(
                `${config.server}/requests/update-request`,
                { requestId, foodType, cookedFood },
                { withCredentials: true }
            );

            if (response.data.success)
                return response.data;
            else
                throw new Error(data.message);
        }
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const cancelRequest = async (requestId, reason) => {
    try {
        const response = await axios.post(
            `${config.server}/requests/cancel-request`,
            { requestId, reason },
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

export const getRequest = async (requestId) => {
    try {
        const response = await axios.post(
            `${config.server}/requests/get-request`,
            { requestId },
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

export const confirmFulfillmentByUser = async (requestId, status) => {
    try {
        const response = await axios.post(
            `${config.server}/requests/fulfill-request`,
            { requestId, status },
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