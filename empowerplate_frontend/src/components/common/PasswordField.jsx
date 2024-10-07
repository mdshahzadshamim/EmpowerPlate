import React, { useRef, useState } from 'react';

function PasswordField({ value, onChange, placeholder = "" }) {
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    if (passwordRef.current) {
      passwordRef.current.type = passwordRef.current.type === "password" ? "text" : "password";
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        ref={passwordRef}
        type="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
  );
}

export default PasswordField;
