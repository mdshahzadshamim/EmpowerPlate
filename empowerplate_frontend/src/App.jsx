import RequestForm from "./pages/test/Test"
import SignupForm from "./pages/user/SignupForm";
import LogInForm from "./pages/auth/LoginForm";
import LogOutButton from "./pages/others/LogoutButton"
import UpdateUserDetails from "./pages/user/UpdateUserDetails";
import UpdateUserPassword from "./pages/user/UpdateUserPassword";
import SendCodeButton from "./pages/others/SendCodeButton";
import VerifyEmail from "./pages/user/VerifyEmail";
import CreateRequest from "./pages/request/CreateRequest";
import LinkedRequests from "./pages/user/LinkedRequests";


function App() {

  return (
    <>
    {/* <RequestForm /> */}
    
    <LogOutButton />
    <LinkedRequests />
    <LogInForm />
    {/* <SendCodeButton />
    <SignupForm />
    <UpdateUserDetails />
    <UpdateUserPassword/>
    <VerifyEmail />
    <CreateRequest /> */}
    </>
  )
}

export default App
