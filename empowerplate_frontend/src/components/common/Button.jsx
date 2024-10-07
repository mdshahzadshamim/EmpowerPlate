import React from "react";

function Button({text}) {

  return (
    <button
      className="bg-gray-100 text-gray-900 font-semibold rounded-lg px-6 py-3 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
    >
      `${text}`
    </button>
  );
};

export default Button;
