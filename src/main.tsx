import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./utils/ErrorBoundary.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    {/* browser router is used here, as Link component was causing some error (error page) in Error Boundary 
    (Link, Navigate components can only used in context for Router)*/}
    <BrowserRouter>
      <ErrorBoundary fallback={<ErrorPage />}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);
