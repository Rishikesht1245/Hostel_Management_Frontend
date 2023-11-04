import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAppDispatch } from "../../App";
import { login } from "../../apiRoutes/staff";
import { ILoginResponse } from "../../interfaces/auth";
import { currentUserActions } from "../../store/currentUserSlice";
import { getLocalData, saveLocally } from "../../utils/localStorage";
import LoginForm from "../../components/forms/LoginForm";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = getLocalData();

  // checking if users is logged in
  if (currentUser) return <Navigate to={`/staffs/dashboard`} />;

  const loginHandler = (token: string, data: ILoginResponse) => {
    saveLocally(token, data, "staff");
    dispatch(
      currentUserActions.login({ token, currentUser: data, role: "staff" })
    );
    navigate("/staffs/dashboard");
  };
  return (
    <>
      <div className="parent-container lg:max-w-md">
        <h2 className="mb-6">Staff login</h2>
        <LoginForm loginHandler={loginHandler} onSubmit={login} />
        <div className="ml-auto text-sm pt-1 px-2 hover:text-blue-700">
          <Link to={"/chief-wardens/login"}>Chief-Warden →</Link>
        </div>
      </div>
    </>
  );
};
export default Login;
