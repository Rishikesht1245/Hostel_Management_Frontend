import * as yup from "yup";

export const mealPlanSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .trim()
    .min(5, "The title must be longer than 5 characters")
    .max(15, "The title must be shorter than 15 characters"),
  price: yup
    .number()
    .positive()
    .required("Price is required")
    .min(1000, "Minimum 1000")
    .max(10000, "Maximum 10000"),
  breakfast: yup
    .string()
    .required("Breakfast is required")
    .trim()
    .min(5, "Break fast must be longer than 5 characters")
    .max(100, "Break fast must be longer than 5 characters"),
  lunch: yup
    .string()
    .required("lunch is required")
    .trim()
    .min(5, "lunch must be longer than 5 characters")
    .max(100, "lunch must be longer than 5 characters"),
  evening: yup
    .string()
    .required("evening is required")
    .trim()
    .min(5, "evening must be longer than 5 characters")
    .max(100, "evening must be longer than 5 characters"),
  dinner: yup
    .string()
    .required("dinner is required")
    .trim()
    .min(5, "dinner must be longer than 5 characters")
    .max(100, "dinner must be longer than 5 characters"),
  active: yup.bool().oneOf([true, false], "Must be a true or false"),
  subscribers: yup.number().positive().integer(),
});

export const newStaffSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required()
    .test("isvalidEmail", "Invalid e-Mail", (arg) =>
      /[a-z0-9]+@[a-z0-9]+.com/i.test(arg)
    ),
  name: yup
    .string()
    .required()
    .trim()
    .min(4, "Invalid staff name")
    .max(20, "Invalid staff name"),
  password: yup
    .string()
    .trim()
    .required("Required")
    .min(8, "Invalid Password")
    .max(16, "Invalid Password"),
  mobile: yup
    .string()
    .required()
    .trim()
    .matches(/^[0-9]{10}$/, "Invalid mobile number"),
  gender: yup.string().required().oneOf(["female", "male"], "Invalid gender"),
  role: yup
    .string()
    .required()
    .oneOf(["maintenance", "chef", "wardenF"], "Invalid Role"),
  building: yup
    .string()
    .required()
    .trim()
    .min(4, "Invalid building")
    .max(16, "Invalid building"),
  city: yup
    .string()
    .required()
    .trim()
    .min(4, "Invalid city")
    .max(16, "Invalid city"),
  pin: yup
    .string()
    .trim()
    .required()
    .matches(/^[0-9]{6}$/, "Invalid Pin Code"),
  state: yup
    .string()
    .required()
    .trim()
    .min(4, "Invalid state")
    .max(16, "Invalid state"),
  country: yup
    .string()
    .required()
    .trim()
    .min(4, "Invalid country")
    .max(16, "Invalid country"),
});
