import { ILogin, ILoginResponse } from "../../interfaces/auth";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useCallback, useState } from "react";
import { getLocalData } from "../../utils/localStorage";
import { Navigate } from "react-router-dom";
import Input from "./Input";
import Button from "../UI/Button";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../UI/LoadingButton";
import { loginSchema } from "../../schema/auth";

const LoginForm = ({ loginHandler, onSubmit }: Props) => {
  const [message, setMessage] = useState<string | null>(null);
  const currentUser = getLocalData();

  // function is written inside useCall back so only rerender depends on the dependency array
  // function to navigate user to the correct route
  const routeTo = useCallback((role: string): string | undefined => {
    switch (role) {
      case "student":
        return "students";
      case "chiefWarden":
        return "chief-wardens";
      case "staff":
        return "staffs";
      default:
        break;
    }
  }, []);
  // checking if users is logged in
  if (currentUser)
    return <Navigate to={`/${routeTo(currentUser.role)}/dashboard`} />;

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(formData, { setSubmitting }) => {
          setMessage(null);
          setSubmitting(true);
          // invoking login function
          onSubmit(formData)
            // destructuring response
            .then(({ data: { token, data } }) => {
              loginHandler(token, data);
              toast.success(`Welcome ${data.name}`, {
                style: { background: "rgba(0,0,0,0.9)", color: "white" },
              });
            })
            // destructuring error
            .catch(
              ({
                response: {
                  data: { message },
                },
              }) => setMessage(message)
            )
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col justify-center gap-4 px-1 mb-3">
            <Input type="email" placeholder="School mail" name="email" />
            <PasswordInput
              placeholder="Password"
              name="password"
              id="password"
            />
            {isSubmitting ? (
              <LoadingButton />
            ) : (
              <Button type="submit">Login</Button>
            )}
          </Form>
        )}
      </Formik>
      {message && (
        <span className="text-center text-md font-semibold text-red-800">
          {message}
        </span>
      )}
    </>
  );
};

interface Props {
  loginHandler: (token: string, data: ILoginResponse) => void;
  onSubmit: (FormData: ILogin) => Promise<any>;
}
export default LoginForm;
