import { Routes, Route, Navigate } from "react-router-dom";
import StudentRoutes from "./routes/Student";
import StaffRoutes from "./routes/Staff";
import ChiefWardenRoutes from "./routes/ChiefWarden";
import { getLocalData } from "./utils/localStorage";
import NotFound from "./pages/NotFound";
import { AppDispatch, RootState } from "./store/store";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

function App() {
  const currentUser = getLocalData();

  return (
    <>
      <Routes>
        <Route path="/students/*" element={<StudentRoutes />} />
        <Route path="/chief-wardens/*" element={<ChiefWardenRoutes />} />
        <Route path="/staffs/*" element={<StaffRoutes />} />
        {/* Home route */}
        <Route
          path="/"
          element={
            //if logged in
            currentUser?.role === "student" ? (
              <Navigate to="/students/dashboard" />
            ) : (
              // not logged in
              <Navigate to="/students/login" />
            )
          }
        />
        {/* not found */}
        <Route path="/*" element={<NotFound role="student" />} />
      </Routes>
      <Toaster />
    </>
  );
}

//  type of the useDispatch function
type DispatchFunc = () => AppDispatch;
// useDispatch function with type === useAppDispatch
export const useAppDispatch: DispatchFunc = useDispatch;

//use Selector function with types === useAppSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default App;
