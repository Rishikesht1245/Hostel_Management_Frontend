import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./ErrorBoundary.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<ErrorPage />}>
    <App />
  </ErrorBoundary>
);
