import { ILogin, ILoginResponse } from "../../interfaces/auth";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Input from "./Input";
import Button from "../UI/Button";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../UI/LoadingButton";
import { loginSchema } from "../../schema/auth";

const LoginForm = ({ loginHandler, onSubmit }: Props) => {
  const [message, setMessage] = useState<string | null>(null);

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
