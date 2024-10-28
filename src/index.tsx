import React from "react";
import ReactDOM from "react-dom/client";
import { ContextProvider } from "./context";
import App from "./App";

import "./index.css";
import "./qr-scanner-start.js";

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
