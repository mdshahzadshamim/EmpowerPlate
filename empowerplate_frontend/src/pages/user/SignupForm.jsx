import React, { useState } from 'react';
import { registerUser } from "../../services/userService";
import { cities } from '../../../constantsConfig';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';



function SignupForm() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("END_USER");
  const [city, setCity] = useState("MOHANIA");
  const [passkeyOption, setPasskeyOption] = useState(false);
  const [passkey, setPasskey] = useState("");

  const userTypes = ["ADMIN", "VOLUNTEER", "END_USER"];


  const handleSignup = async (e) => {
    e.preventDefault();
    const tempUser = { username, email, phone, name, password, userType, city, passkey };
    console.log(tempUser);

    try {
      const userData = await registerUser(username, email, phone, name, password, userType, city, passkey);
      if (userData) {
        const user = userData.data.user;
        navigate("/users/login");
        console.log("Signup successful:", user);
      }
    } catch (error) {
      console.error("Signup failed:", error.message);
    }
  };

  const handleUserType = (e) => {
    const selectedUserType = e.target.value;
    setUserType(selectedUserType);
    setPasskeyOption(selectedUserType === "ADMIN" || selectedUserType === "VOLUNTEER");
    if(selectedUserType === "END_USER")
      setPasskey("");
  };

  return (
    <form
      onSubmit={handleSignup}
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
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        value={userType}
        onChange={handleUserType}
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {userTypes.map((userType) => (
          <option key={userType} value={userType}>
            {userType}
          </option>
        ))}
      </select>
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

      {passkeyOption && (
        <input
          type="password"
          placeholder="Passkey"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          required
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
      >
        Sign Up
      </button>
      <p className='mt-2 text-center text-base text-black/60'>
        Already havean account?&nbsp;
        <Link to="/users/login"
          className='font-medium text-primary transition-all duration-200 hover:underline'>
          Log In
        </Link>
      </p>
    </form>
  );
}

export default SignupForm;
