import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAppDispatch } from "../../App";
import { ILoginResponse } from "../../interfaces/auth";
import { getLocalData, saveLocally } from "../../utils/localStorage";
import { currentUserActions } from "../../store/currentUserSlice";
import { login } from "../../apiRoutes/chiefWarden";
import LoginForm from "../../components/forms/LoginForm";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = getLocalData();

  // checking if users is logged in
  if (currentUser) return <Navigate to={`/chief-wardens/dashboard`} />;

  const loginHandler = (token: string, data: ILoginResponse) => {
    saveLocally(token, data, "student");
    dispatch(
      currentUserActions.login({
        token,
        currentUser: data,
        role: "chiefWarden",
      })
    );
    navigate("/chief-wardens/dashboard");
  };
  return (
    <div className="parent-container lg:max-w-md">
      <h2 className="mb-6"> Chief warden Login</h2>
      <LoginForm loginHandler={loginHandler} onSubmit={login} />
      <div className="ml-auto text-sm pt-1 px-2 hover:text-blue-700">
        <Link to={"/staffs/login"}>Staff Login →</Link>
      </div>
    </div>
  );
};
export default Login;
