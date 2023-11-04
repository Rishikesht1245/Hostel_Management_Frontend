import { Routes, Route } from "react-router-dom";
import StaffLayout from "../layouts/Staff";
import { Suspense, lazy } from "react";
import Loader from "../components/UI/Loader";

const Login = lazy(() => import("../pages/staff/Login"));

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
      </Route>
    </Routes>
  );
};
export default Staff;
