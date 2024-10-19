import React from 'react';
import email from "../../config/config";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-5 mt-12 w-full flex-shrink-0">
      <div className="container h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* About Section */}
          <div>
            <h2 className="text-xl font-bold mb-2">About</h2>
            <p>
              <strong>EmpowerPlate - Food Security Platform</strong> is a MERN stack project featuring 18 backend controllers, JWT-based authentication with cookies, and Redux Toolkit for state management. It streamlines food distribution by providing real-time connectivity with food bank inventories, allowing for request acceptance and secure transactions through 10+ additional functions and middleware.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-bold mb-2">Contact</h2>
            <p className="mb-2">For more details, reach out to us:</p>
            <p className="font-semibold">Email: <a href={`mailto: ${email}`} className="text-blue-400 hover:text-blue-300">{email}</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
