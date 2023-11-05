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
