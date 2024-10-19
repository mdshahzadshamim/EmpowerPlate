import React, { useRef, useState } from 'react'
import PasswordField from '../../components/common/PasswordField';
import { updateUserPassword } from '../../services/userService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function UpdateUserPassword() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  if (!currentUser) {
    console.error("Please login,", "No current user found");
    return;
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    try {
      const userData = await updateUserPassword(oldPassword, newPassword, confirmNewPassword);
      if (userData) {
        console.log("Password updated");
        navigate("/");
      }
    } catch (error) {
      console.error("Password wasn't updated ", error.message)
    }
  }
  return (
    <form
      onSubmit={handlePasswordUpdate}
      className="flex flex-col space-y-4 max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16"
    >
      <PasswordField
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <PasswordField
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <PasswordField
        placeholder="Confirm New Password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
      >
        Update Password
      </button>
    </form>
  )
}

export default UpdateUserPassword
