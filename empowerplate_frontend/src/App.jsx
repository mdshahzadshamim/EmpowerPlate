import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { refreshAccessToken } from "./services/authService";
import { login, logout } from "./features/authSlice";
import { setRequests } from "./features/requestSlice";
import { useCookies } from 'react-cookie';
// import { useNavigate } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const [cookies] = useCookies(['refreshToken']);
  // const navigate = useNavigate();
  // const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const refreshToken = cookies.refreshToken;
    if (refreshToken) {
      refreshAccessToken()
        .then((userData) => {
          if (userData.success) {
            dispatch(login(userData.data.user));
          } else {
            dispatch(logout());
          }
        })
        .catch(() => {
          dispatch(logout());
          dispatch(setRequests([]));
        });
    } else {
      dispatch(logout());
      dispatch(setRequests([]));
    }
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
