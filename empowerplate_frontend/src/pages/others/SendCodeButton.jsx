import React from 'react'
import { sendCode } from '../../services/userService'
import { useSelector } from 'react-redux'

function SendCodeButton() {
    const currentUser = useSelector((state) => state.auth.user);
  
    if (!currentUser) {
      console.error("Please login,", "No current user found");
      return;
    }

    const handleSendOTP = async () => {
        try {
            const sentOTP = await sendCode();
            if (sentOTP) {
                console.log("OTP sent successfully");
            }
        } catch (error) {
            console.error("Failed to send OTP ", error)
        }
    }
    
  return (
    <button
      onClick={handleSendOTP}
      className="bg-gray-100 text-gray-900 font-semibold rounded-lg px-6 py-3 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
    >
      Send OTP
    </button>
  )
}

export default SendCodeButton
