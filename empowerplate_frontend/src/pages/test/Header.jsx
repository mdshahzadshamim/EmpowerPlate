import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logOutUser } from "../../services/authService";
import { logout } from "../../features/authSlice";
import { setRequests } from "../../features/requestSlice";


function Header() {
  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => (state.auth.isAuthenticated && state.auth.user.userType === "ADMIN"));
  const isEndUser = useSelector((state) => (state.auth.isAuthenticated && state.auth.user.userType === "END_USER"));
  const isVerified = useSelector((state) => (state.auth.isAuthenticated && state.auth.user.isVerified));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const logoutData = await logOutUser();
      if (logoutData) {
        dispatch(logout());
        dispatch(setRequests([]));
        navigate("/");
        console.log("User logged out successfully!");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    {
      name: "Home",
      url: "/",
      active: true
    },
    {
      name: "Pending Requests",
      url: "/users/pending-requests",
      active: isAdmin
    },
    {
      name: "Linked Requests",
      url: "/users/linked-requests",
      active: authStatus
    },
    {
      name: "Create Request",
      url: "/requests/create",
      active: isEndUser
    },
    {
      name: "Sign Up",
      url: "/users/register",
      active: !authStatus
    },
    {
      name: "Log In",
      url: "/users/login",
      active: !authStatus
    },
    {
      name: "Log Out",
      active: authStatus,
      onClick: handleLogout
    },
    // {
    //   name: "Account",
    //   url: "/",
    //   active: authStatus
    // },
  ]

  const accountDropdownItems = [
    {
      name: "Update Details",
      url: "/users/update-details",
      active: authStatus
    },
    {
      name: "Update Password",
      url: "/users/update-password",
      active: authStatus
    },
    {
      name: "Verify Email",
      url: "/users/verify-email",
      active: !isVerified
    },
    {
      name: "Log Out",
      onClick: handleLogout,
      active: authStatus
    }
  ];

  return (
    <header>
      <nav>
        <div className='text-blue-700'>
          <Link to="/">EmpowerPlate</Link>
        </div>
        <ul>
          {navItems.map((item) => (
            item.active ?
              (
                <li key={item.name}>
                  <button
                    onClick={item.name === "Log Out"
                      ? item.onClick
                      : () => navigate(item.url)}
                  >
                    {item.name}
                  </button>
                </li>
              )
              : null
          ))}

          {authStatus && (
            <li>
              <button>Account</button>
              <ul>
                {accountDropdownItems.map((item) => (
                  item.active ?
                    (
                      <li key={item.name}>
                        <button onClick={item.onClick
                          ? item.onClick
                          : () => navigate(item.url)}
                        >
                        </button>
                      </li>
                    )
                    : null
                ))}
              </ul>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
