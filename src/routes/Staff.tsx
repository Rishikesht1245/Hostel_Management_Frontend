import { Routes, Route } from "react-router-dom";
import StaffLayout from "../layouts/Staff";
import { Suspense, lazy } from "react";
import Loader from "../components/UI/Loader";
import ProtectedRoute from "../utils/ProtectedRoute";
import NotFound from "../pages/NotFound";

const Login = lazy(() => import("../pages/staff/Login"));
const Dashboard = lazy(() => import("../pages/staff/Dashboard"));
const MealPlans = lazy(() => import("../pages/staff/MealPlans.chef"));
const Maintenance = lazy(() => import("../pages/staff/Maintenance"));
const Profile = lazy(() => import("../pages/staff/Profile"));

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
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<Loader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<Loader />}>
                <Profile />
              </Suspense>
            }
          />
          {/* chef routes */}
          <Route element={<ProtectedRoute role="staff" department="chef" />}>
            <Route
              path="meals"
              element={
                <Suspense fallback={<Loader />}>
                  <MealPlans />
                </Suspense>
              }
            />
          </Route>
          {/* Maintenance */}
          <Route
            element={<ProtectedRoute role="staff" department="maintenance" />}
          >
            <Route
              path="maintenance"
              element={
                <Suspense fallback={<Loader />}>
                  <Maintenance />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>
      {/* page not found */}
      <Route path="/*" element={<NotFound role="staff" />} />
    </Routes>
  );
};
export default Staff;
