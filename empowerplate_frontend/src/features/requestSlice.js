import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    requests: [],
    isLoading: false,
    error: null
}

const requestSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        requests: (state, action) => {},
        request: (state, action) => {},
    }
})


export const { requests, request } = requestSlice.actions;
export default requestSlice.reducer;