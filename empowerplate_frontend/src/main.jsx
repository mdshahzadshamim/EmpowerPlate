// main.jsx
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";
import App from "./App";
import './index.css';

import SignupForm from "./pages/user/SignupForm";
import LogInForm from "./pages/auth/LoginForm";
import UpdateUserDetails from "./pages/user/UpdateUserDetails";
import UpdateUserPassword from "./pages/user/UpdateUserPassword";
import VerifyEmail from "./pages/user/VerifyEmail";
import CreateRequest from "./pages/request/CreateRequest";
import LinkedRequests from "./pages/user/LinkedRequests";
import PendingRequests from "./pages/user/PendingRequests";
import HomePage from './pages/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/users/login",
        element: <LogInForm />,
      },
      {
        path: "/users/register",
        element: <SignupForm />,
      },
      {
        path: "/users/linked-requests",
        element: <LinkedRequests />,
      },
      {
        path: "/users/pending-requests",
        element: <PendingRequests />,
      },
      {
        path: "/users/update-details",
        element: <UpdateUserDetails />,
      },
      {
        path: "/users/update-password",
        element: <UpdateUserPassword />,
      },
      {
        path: "/users/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/requests/create",
        element: <CreateRequest />,
      },
    ]
  }
])



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {/* <App /> */}
        <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  </StrictMode>
);



// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
