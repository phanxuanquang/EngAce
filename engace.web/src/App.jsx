import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./routes";
// import { GoogleLogin } from "@react-oauth/google";
// import { useGoogleLogin } from "@react-oauth/google";
// import { googleLogout } from "@react-oauth/google";
// import axios from "axios";

function App() {
  // const handleSuccess = (credentialResponse) => {
  //   console.log(credentialResponse);
  // };

  // const handleError = () => {
  //   console.log("Login Failed");
  // };

  // const logout = () => {
  //   googleLogout();
  // };

  // ko co level thi' back lại

  return <RouterProvider router={router} />;
}

export default App;
