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
        updateOneRequest    : (state, action) => {
            console.log("In Update");
            const request = action.payload;
            const requestId = request._id;
            const index = state.requests.findIndex(item => item._id === requestId);
            if (index !== -1) {
                state.requests[index] = request;
            } else {
                state.requests.push(request);
            }
        },
    }
});

export const { setRequests, updateOneRequest } = requestSlice.actions;
export default requestSlice.reducer;
