import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ThemeProvider from "./theme";
import { Provider } from "react-redux";
import { store } from "./redux";

const root = ReactDOM.createRoot(document.getElementById("root"));

const clientId = "918170775082-ngpd10u94hqkor1g3vveprfbhr8ov3r1.apps.googleusercontent.com";
const scopes = "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/generative-language.retriever"; 

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <GoogleOAuthProvider
          clientId={clientId}
          scope={scopes}
        >
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
