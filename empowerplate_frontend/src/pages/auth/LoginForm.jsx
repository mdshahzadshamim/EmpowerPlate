import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logInUser } from "../../services/authService";
import { login } from "../../features/authSlice";
import { Link, useNavigate } from 'react-router-dom';


const LogInForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); 
  const currentUser = useSelector((state) => state.auth.user);

  const [identifierType, setIdentifierType] = useState("username");
  const [identifierValue, setIdentifierValue] = useState("");
  const [password, setPassword] = useState("12345678");
  const dispatch = useDispatch();


  const handleLogin = async (e) => {
    e.preventDefault();
    const identifier = { type: identifierType, value: identifierValue };
    try {
      console.log("From Login Component: ", identifier, password);
      const userData = await logInUser(identifier, password);
      if (userData) {
        const user = userData.data.user;
        dispatch(login(user));
        navigate("/");
        console.log("Login successful:", user);
      }
    } catch (error) {
      setMessage("Invalid Details");
      console.error("Login failed:", error.message);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md space-y-4 max-w-md mx-auto mt-16"
    >
      <select
        value={identifierType}
        onChange={(e) => setIdentifierType(e.target.value)}
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="username">Username</option>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
      </select>

      <input
        type="text"
        placeholder={`Enter your ${identifierType}`}
        value={identifierValue}
        onChange={(e) => setIdentifierValue(e.target.value)}
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

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
      >
        Log In
      </button>
      <span id="message">{message}</span>
      <p className='mt-2 text-center text-base text-black/60'>
        Don&apos;t have any account?&nbsp;
        <Link to="/users/register"
          className='font-medium text-primary transition-all duration-200 hover:underline'>
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default LogInForm;
