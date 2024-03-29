import { Link, useNavigate, Navigate } from "react-router-dom";
import LoginForm from "../../components/forms/LoginForm";
import { ILoginResponse } from "../../interfaces/auth";
import { getLocalData, saveLocally } from "../../utils/localStorage";
import { useAppDispatch } from "../../App";
import { currentUserActions } from "../../store/currentUserSlice";
import { login } from "../../apiRoutes/student";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = getLocalData();

  // checking if users is logged in
  if (currentUser) return <Navigate to={`/students/dashboard`} />;

  // actions after successful user login
  const loginHandler = (token: string, data: ILoginResponse) => {
    saveLocally(token, data, "student");
    dispatch(
      currentUserActions.login({ token, currentUser: data, role: "student" })
    );
    navigate("/students/dashboard");
  };

  return (
    <div className="parent-container lg:max-w-md">
      <h2 className="mb-6">Student login</h2>
      <LoginForm loginHandler={loginHandler} onSubmit={login} />
      <div className="ml-auto text-sm pt-1 px-2 hover:text-blue-700">
        <Link to={"/students/admission/details"}>
          New Admission <span className="text-lg">→</span>
        </Link>
      </div>
    </div>
  );
};
export default Login;
