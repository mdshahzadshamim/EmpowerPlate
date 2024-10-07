import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    requests: [],
    isLoading: false,
    error: null
};

const requestSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        setRequests: (state, action) => {
            const incomingRequests = action.payload;
            state.requests = incomingRequests;
        },
        updateRequest: (state, action) => {
            const { request } = action.payload;
            const requestId = request._id;
            const index = state.requests.findIndex(item => item._id === requestId);
            if (index !== -1) {
                state.requests[index] = request;
            }
        },
    }
});

export const { setRequests, updateRequest } = requestSlice.actions;
export default requestSlice.reducer;
