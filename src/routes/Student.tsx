import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import StudentLayout from "../layouts/Student";
import Loader from "../components/UI/Loader";
import NewStudentLayout from "../layouts/NewStudent";
import ProtectedRoute from "../utils/ProtectedRoute";
import NotFound from "../pages/NotFound";

const LoginPage = lazy(() => import("../pages/students/Login"));
const DetailsForm = lazy(
  () => import("../pages/students/admission/DetailsForm")
);
const MealPlans = lazy(() => import("../pages/students/admission/MealPlans"));
const Blocks = lazy(() => import("../pages/students/admission/Blocks"));
const Rooms = lazy(() => import("../pages/students/admission/Rooms"));
const Dashboard = lazy(() => import("../pages/students/Dashboard"));
const MealPlanPage = lazy(() => import("../pages/students/MealPlans"));
const Profile = lazy(() => import("../pages/students/Profile"));
const Complaints = lazy(() => import("../pages/students/Complaints"));
const Payment = lazy(() => import("../pages/students/Payment"));
const Chats = lazy(() => import("../pages/students/Chats"));

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
        {/* Protected Route */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<Loader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="meals"
            element={
              <Suspense fallback={<Loader />}>
                <MealPlanPage />
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
          <Route
            path="complaints"
            element={
              <Suspense fallback={<Loader />}>
                <Complaints />
              </Suspense>
            }
          />
          <Route
            path="payments"
            element={
              <Suspense fallback={<Loader />}>
                <Payment />
              </Suspense>
            }
          />
          <Route
            path="chat"
            element={
              <Suspense fallback={<Loader />}>
                <Chats />
              </Suspense>
            }
          />
        </Route>
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

      {/* not found */}
      <Route path="/*" element={<NotFound role="student" />} />
    </Routes>
  );
};
export default Student;
