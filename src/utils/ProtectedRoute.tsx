import { useCallback, useState, useEffect } from "react";
import { getLocalData } from "./localStorage";
import {
  ICurrentUser,
  ICurrentUserDetails,
  ILoginResponse,
} from "../interfaces/auth";
import { checkAuth } from "../config/api";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { currentUserActions } from "../store/currentUserSlice";
import { useAppDispatch } from "../App";

const ProtectedRoute = ({ role, department }: Props) => {
  const [auth, setAuth] = useState<
    ILoginResponse | ICurrentUser | null | false
  >(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //   checking if local storage have value or not
  useEffect(() => {
    const localData = getLocalData() as ICurrentUser | null;
    const currentUser = localData?.currentUser as ICurrentUserDetails;
    if (!localData || !currentUser) {
      dispatch(currentUserActions.logout());
      return setAuth(false);
    }
    //     checking auth api in server --- jwt verification
    checkAuth
      .get("", {
        headers: { Authorization: `Bearer${localData?.token}` },
      })
      .then(() => {
        // props -- if department is not provided as props (protected routes based on dept)
        if (!department) {
          dispatch(currentUserActions.login(localData));
          return setAuth(localData);
        }
        //   dept based protected route : don't allow the user to go to this route if dept is not matching
        if (department !== currentUser?.department) {
          dispatch(currentUserActions.login(currentUser));
          setAuth(localData);
          return navigate("/staffs/dashboard");
        }
        dispatch(currentUserActions.login(localData));
        return setAuth(localData);
      })
      .catch(() => {
        // in case verification fails
        dispatch(currentUserActions.logout());
        setAuth(false);
      });
  }, []);

  // use call back function prevents the recreation of the routeTo function
  const routeTo = useCallback((role: string): string | undefined => {
    switch (role) {
      case "chiefWarden":
        return "chief-wardens";
      case "staff":
        return "staffs";
      case "student":
        return "students";
      default:
        break;
    }
  }, []);

  if (auth === null) return null;

  return auth ? <Outlet /> : <Navigate to={`/${routeTo(role)}/login`} />;
  return <div>ProtectedRoute</div>;
};

interface Props {
  role: "chiefWarden" | "staff" | "student";
  department?: "maintenance" | "chef" | "warden";
}
export default ProtectedRoute;
