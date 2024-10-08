import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../services/authService";
import { logout } from "../../features/authSlice";
import { setRequests } from "../../features/requestSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  if (!currentUser) {
    console.error("Please login,", "No current user found");
    return;
  }

  const handleLogout = async () => {
    try {
      const logoutData = await logOutUser();
      if (logoutData) {
        dispatch(logout());
        dispatch(setRequests([]));
        console.log("User logged out successfully!");
      }
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

export default LogoutButton;
