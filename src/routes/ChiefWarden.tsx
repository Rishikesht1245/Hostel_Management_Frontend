import { Routes, Route } from "react-router-dom";
import ChiefWardenLayout from "../layouts/ChiefWarden";
import { Suspense, lazy } from "react";
import Loader from "../components/UI/Loader";

const ChiefWarden = () => {
  const Login = lazy(() => import("../pages/chiefWarden/Login"));
  return (
    <Routes>
      <Route path="/" element={<ChiefWardenLayout />}>
        <Route
          path="/login"
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
export default ChiefWarden;
