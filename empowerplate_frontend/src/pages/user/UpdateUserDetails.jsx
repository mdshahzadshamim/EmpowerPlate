import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cities } from '../../../constantsConfig';
import { updateUserDetails } from '../../services/userService';
import { login } from "../../features/authSlice";
import { useNavigate } from 'react-router-dom';

function UpdateUserDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);


  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [name, setName] = useState(currentUser.name);
  const [city, setCity] = useState(currentUser.city);

  if (!currentUser) {
    console.error("Please login,", "No current user found");
    return;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const userData = await updateUserDetails(username, email, phone, name, city);
      if (userData) {
        const user = userData.data.user;
        dispatch(login(user));
        navigate("/");
        console.log("Update successful ", user);
      }
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="flex flex-col space-y-4 max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16"
    >
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
      >
        Update Details
      </button>
    </form>
  );
}

export default UpdateUserDetails;
