import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../features/authSlice'
import { verifyEmail } from '../../services/userService';
import PasswordField from '../../components/common/PasswordField';

function VerifyEmail() {
  const currentUser = useSelector((state) => state.auth.user);

  if (!currentUser) {
    console.error("Please login,", "No current user found");
    return;
  }

  const dispatch = useDispatch();

  const [code, setCode] = useState("");

  const handleVerification = async (e) => {
    e.preventDefault();

    try {
      const userData = await verifyEmail(code);
      if (userData) {
        const user = userData.data.user;
        dispatch(login(user));
        console.log("User verified ", user);
      }
    } catch (error) {
      console.error("Invalid OTP", error.message);
    }
  }
  return (
    <form
      onSubmit={handleVerification}
      className="flex flex-col space-y-4 max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16"
    >
      <PasswordField
        placeholder="One TIme Password"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
      >
        Verify Email
      </button>

    </form>
  )
}

export default VerifyEmail
