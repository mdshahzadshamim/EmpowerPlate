import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { refreshAccessToken } from "./services/authService";
import { login, logout } from "./features/authSlice";
// import { useNavigate } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    refreshAccessToken()
      .then((userData) => {
        if (userData.success) {
          dispatch(login(userData.data.user));
        } else {
          dispatch(logout());
        }
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
