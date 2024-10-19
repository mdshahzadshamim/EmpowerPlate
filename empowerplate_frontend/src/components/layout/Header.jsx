import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOutUser } from "../../services/authService";
import { logout } from "../../features/authSlice";
import { setRequests } from "../../features/requestSlice";
import { sendCode } from '../../services/userService';

function Header() {
  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => authStatus && state.auth.user.userType === "ADMIN");
  const isEndUser = useSelector((state) => authStatus && state.auth.user.userType === "END_USER");
  const isVerified = useSelector((state) => authStatus && state.auth.user.isVerified);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // To track current URL
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      const logoutData = await logOutUser();
      if (logoutData) {
        dispatch(logout());
        dispatch(setRequests([]));
        setIsDropdownOpen(false); // Close dropdown after logout
        navigate("/users/login");
        console.log("User logged out successfully!");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSendOTP = async () => {
    try {
      const sentOTP = await sendCode();
      if (sentOTP) {
        console.log("OTP sent successfully");
        navigate ("/users/verify-email");
      }
    } catch (error) {
      console.error("Failed to send OTP ", error)
    }
  }

  const toggleDropdown = () => setIsDropdownOpen((prevState) => !prevState);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const navItems = [
    { name: "Home", url: "/", active: true },
    { name: "Pending Requests", url: "/users/pending-requests", active: isAdmin },
    { name: "Linked Requests", url: "/users/linked-requests", active: authStatus },
    { name: "Create Request", url: "/requests/create", active: isEndUser },
    { name: "Sign Up", url: "/users/register", active: !authStatus },
    { name: "Log In", url: "/users/login", active: !authStatus },
  ];

  const accountDropdownItems = [
    { name: "Update Details", url: "/users/update-details", active: authStatus },
    { name: "Update Password", url: "/users/update-password", active: authStatus },
    { name: "Verify Email", onClick: handleSendOTP, active: !isVerified },
    { name: "Log Out", onClick: handleLogout, active: authStatus }
  ];

  // Function to check if the current tab is active based on the URL
  const isActiveTab = (path) => location.pathname === path;

  return (
    <header className="bg-gray-800 text-white p-5">
      <nav className="flex justify-between items-center">
        <div className="text-3xl font-bold">
          <Link to="/" className="hover:text-blue-400">EmpowerPlate</Link>
        </div>

        <ul className="flex space-x-4">
          {navItems.map((item) => (
            item.active && (
              <li key={item.name}>
                <button
                  onClick={item.onClick ? item.onClick : () => navigate(item.url)}
                  className={`${isActiveTab(item.url) ? 'font-bold text-blue-400' : 'hover:text-blue-400'}`}
                >
                  {item.name}
                </button>
              </li>
            )
          ))}

          {authStatus && (
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="hover:text-blue-400"
              >
                Account
              </button>
              {isDropdownOpen && (
                <ul className="absolute bg-gray-700 text-white mt-2 rounded shadow-lg w-48 right-0">
                  {accountDropdownItems.map((item) => (
                    item.active && (
                      <li key={item.name} className="px-4 py-2 hover:bg-gray-600">
                        <button
                          onClick={item.onClick ? item.onClick : () => navigate(item.url)}
                          className="w-full text-left"
                        >
                          {item.name}
                        </button>
                      </li>
                    )
                  ))}
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
