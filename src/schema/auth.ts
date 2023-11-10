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

export const resetPasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .trim()
    .required("Required")
    .min(6, "Invalid Password")
    .max(16, "Invalid Password"),
  newPassword: yup
    .string()
    .trim()
    .required("Required")
    .min(6, "Invalid Password")
    .max(16, "Invalid Password"),
  confirmPassword: yup
    .string()
    .trim()
    .required("Required")
    .oneOf([yup.ref("newPassword")], "Password must match"),
});
