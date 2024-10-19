import React from 'react';
import { Link } from 'react-router-dom';


function HomePage() {
  return (
    <div className="flex flex-col">
      <header className="bg-gray-800 text-white px-5 py-3 shadow-md">
        <div className="container">
          <h1 className="text-xl font-bold">Welcome to Food Security Platform</h1>
          <p className="mt-2">Streamlining food distribution for those in need.</p>
        </div>
      </header>

      <main className="container p-5">
        {/* Introduction Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What is Food Security Platform?</h2>
          <p>
            The <strong>Food Security Platform</strong> is a MERN stack-based solution that bridges the gap between food donors and recipients. 
            Our system integrates food banks, volunteers, and recipients, allowing for real-time inventory tracking, secure transaction management, 
            and streamlined food distribution. With JWT authentication and role-based access, it ensures security for all parties involved.
          </p>
        </section>

        {/* How it Works Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <ol className="list-decimal pl-6">
            <li className="mb-2">
              <strong>Create an Account:</strong> Sign up as a donor, recipient, or volunteer. Ensure that you verify your email for full access.
            </li>
            <li className="mb-2">
              <strong>Manage Requests:</strong> Donors can create donation offers, and recipients can submit requests for food. Admins and volunteers ensure smooth transactions.
            </li>
            <li className="mb-2">
              <strong>Real-time Connectivity:</strong> Our system connects with food bank inventories to ensure food availability for those in need. 
            </li>
            <li className="mb-2">
              <strong>Secure Transactions:</strong> Food requests and donations are managed through secure connections, with JWT-based authentication for enhanced safety.
            </li>
            <li className="mb-2">
              <strong>Track & Update:</strong> All parties can track their requests, donations, and inventory statuses through our easy-to-use platform.
            </li>
          </ol>
        </section>

        {/* Call to Action */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <div className="flex space-x-4">
            <Link to="/users/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Sign Up
            </Link>
            <Link to="/users/login" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Log In
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
