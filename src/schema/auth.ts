import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().trim().required("*Required").email("Invalid email"),
  password: yup
    .string()
    .trim()
    .required("*Required")
    .min(6, "Invalid Password")
    .max(16, "Invalid Password"),
});
