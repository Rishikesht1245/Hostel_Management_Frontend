import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import StudentLayout from "../layouts/Student";
import Loader from "../components/UI/Loader";
import NewStudentLayout from "../layouts/NewStudent";

const LoginPage = lazy(() => import("../pages/students/Login"));
const DetailsForm = lazy(
  () => import("../pages/students/admission/DetailsForm")
);
const MealPlans = lazy(() => import("../pages/students/admission/MealPlans"));
const Blocks = lazy(() => import("../pages/students/admission/Blocks"));
const Rooms = lazy(() => import("../pages/students/admission/Rooms"));

const Student = () => {
  return (
    <Routes>
      {/* student layout wrapper with header and footer other routes will be outlets */}
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

      {/* New Admission routes -- separate layout */}
      <Route path="admission" element={<NewStudentLayout />}>
        {/* will be placed as outlet in newStudentLayout don't write slash "/" */}
        <Route
          path="details"
          element={
            <Suspense fallback={<Loader />}>
              <DetailsForm />
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
          path="rooms"
          element={
            <Suspense fallback={<Loader />}>
              <Rooms />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};
export default Student;
