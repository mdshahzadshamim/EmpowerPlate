// authSlice
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload,
            state.isAuthenticated = true,
            state.isLoading = false;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        },
        update: (state, action) => {
            state.user = action.payload
        }

        // updateSpecificPartOfTheState: (state, action) => {
        //     // Only update the `name` property of the user object
        //     state.user = {
        //         ...state.user,  // Copy existing properties of the user
        //         name: action.payload  // Update only the `name` property
        //     };
        // }
    },
});


export const { login, logout, update } = authSlice.actions;
export default authSlice.reducer;