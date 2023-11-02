import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import StudentLayout from "../layouts/Student";
import Loader from "../components/UI/Loader";

const LoginPage = lazy(() => import("../pages/students/Login"));

const Student = () => {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route
          path="login"
          element={
            <Suspense fallback={<Loader />}>
              <LoginPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};
export default Student;
