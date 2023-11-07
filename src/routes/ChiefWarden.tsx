import { Routes, Route } from "react-router-dom";
import ChiefWardenLayout from "../layouts/ChiefWarden";
import { Suspense, lazy } from "react";
import Loader from "../components/UI/Loader";
import ProtectedRoute from "../utils/ProtectedRoute";
import NotFound from "../pages/NotFound";

const Login = lazy(() => import("../pages/chiefWarden/Login"));
const Dashboard = lazy(() => import("../pages/chiefWarden/Dashboard"));
const MealPlans = lazy(() => import("../pages/chiefWarden/MealPlans"));
const Blocks = lazy(() => import("../pages/chiefWarden/Blocks"));
const Staffs = lazy(() => import("../pages/chiefWarden/Staffs"));
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
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<Loader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="mealPlans"
            element={
              <Suspense fallback={<Loader />}>
                <MealPlans />
              </Suspense>
            }
          />
          <Route
            path="blocks"
            element={
              <Suspense fallback={<Loader />}>
                <Blocks />
              </Suspense>
            }
          />
          <Route
            path="staffs"
            element={
              <Suspense fallback={<Loader />}>
                <Staffs />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* page not found */}
      <Route path="/*" element={<NotFound role="chiefWarden" />} />
    </Routes>
  );
};
export default ChiefWarden;
