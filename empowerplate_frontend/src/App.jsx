import RequestForm from "./pages/test/Test"
import SignupForm from "./pages/user/SignupForm";
import LogInForm from "./pages/auth/LoginForm";
import LogOutButton from "./pages/others/LogoutButton"
import UpdateUserDetails from "./pages/user/UpdateUserDetails";
import UpdateUserPassword from "./pages/user/UpdateUserPassword";
import SendCodeButton from "./pages/others/SendCodeButton";
import VerifyEmail from "./pages/user/VerifyEmail";


function App() {

  return (
    <>
    <LogOutButton />
    <SendCodeButton />
    <LogInForm />
    <SignupForm />
    <UpdateUserDetails />
    <UpdateUserPassword/>
    <VerifyEmail />
    </>
  )
}

export default App
