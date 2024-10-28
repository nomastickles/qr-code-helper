import React from "react";
import ReactDOM from "react-dom/client";
import { ContextProvider } from "./context";
import App from "./App";

import "./qr-scanner-start.js";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("reactRoot") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>
);
