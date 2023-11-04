import { Routes, Route } from "react-router-dom";
import StaffLayout from "../layouts/Staff";
import { Suspense, lazy } from "react";
import Loader from "../components/UI/Loader";
import ProtectedRoute from "../utils/ProtectedRoute";

const Login = lazy(() => import("../pages/staff/Login"));
const Dashboard = lazy(() => import("../pages/staff/DashBoard"));

const Staff = () => {
  return (
    <Routes>
      <Route path="/" element={<StaffLayout />}>
        <Route
          path="login"
          element={
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          }
        />
        {/* Protected route */}
        <Route element={<ProtectedRoute role="staff" />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};
export default Staff;
