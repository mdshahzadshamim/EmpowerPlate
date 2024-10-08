import axios from "axios";
import config from "../config/config";

export const registerUser = async (username, email, phone, name, password, userType, city, passkey) => {
    try {
        const response = await axios.post(
            `${config.server}/users/register`,
            { username, email, phone, name, password, userType, city, passkey },
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

export const updateUserDetails = async (username, email, phone, name, city) => {
    try {
        const response = await axios.patch(
            `${config.server}/users/update-details`,
            { username, email, phone, name, city },
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

// export const getAllLinkedRequests = async () => {
//     try {
//         const response = await axios.get(
//             `${config.server}/users/linked-requests`,
//             { withCredentials: true }
//         );

//         if (response.data.success)
//             return response.data;
//         else
//             throw new Error(data.message);
//     } catch (error) {
//         throw error.response?.data?.message || error.message;
//     }
// };

export const getAllLinkedRequests = async () => {
    try {
        const response = await fetch(`${config.server}/users/linked-requests`, {
            credentials: 'include', // This ensures cookies are sent
        });

        if (!response.ok) {
            throw new Error("Failed to fetch linked requests");
        }

        // Process the stream of JSON data
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let result = "";
        let done = false;

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            result += decoder.decode(value, { stream: !done });
        }

        // Parse the accumulated result into a JSON array
        const requests = JSON.parse(result);
        return requests;
    } catch (error) {
        throw error.message;
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

