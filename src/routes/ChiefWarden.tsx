import { Routes, Route } from "react-router-dom";
import ChiefWardenLayout from "../layouts/ChiefWarden";
import { Suspense, lazy } from "react";
import Loader from "../components/UI/Loader";
import ProtectedRoute from "../utils/ProtectedRoute";

const Login = lazy(() => import("../pages/chiefWarden/Login"));
const Dashboard = lazy(() => import("../pages/chiefWarden/Dashboard"));
const ChiefWarden = () => {
  return (
    <Routes>
      <Route path="/" element={<ChiefWardenLayout />}>
        <Route
          path="login"
          element={
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          }
        />
        <Route element={<ProtectedRoute role="chiefWarden" />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};
export default ChiefWarden;
