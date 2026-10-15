import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import PemeliharaanPage from "./pages/PemeliharaanPage.jsx";
import { sedangPemeliharaan } from "./pemeliharaan.js";
import "./styles/tema.css";
import "./styles/font-cv.css";
import "./styles/merek.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {sedangPemeliharaan() ? <PemeliharaanPage /> : <App />}
  </React.StrictMode>
);
