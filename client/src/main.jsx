import React from "react";
import { EcoTokenProvider } from "./context/EcoTokenContext";
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import App from "./App";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <EcoTokenProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </EcoTokenProvider>
);