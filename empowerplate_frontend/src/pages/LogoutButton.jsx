import React from "react";
import { useDispatch } from "react-redux";
import { logOutUser } from "../services/authService";
import { logout } from "../features/authSlice";

const LogOutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const logoutData = await logOutUser();
      if (logoutData) dispatch(logout());
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-100 text-gray-900 font-semibold rounded-lg px-6 py-3 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
    >
      Log Out
    </button>
  );
};

export default LogOutButton;
