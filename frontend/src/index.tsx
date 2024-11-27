import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";

// Инициализируем корневой элемент
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Рендер приложения
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Отчеты по производительности (опционально)
reportWebVitals();
