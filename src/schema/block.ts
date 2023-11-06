import * as yup from "yup";

export const blockSchema = yup.object().shape({
  name: yup
    .string()
    .required("Block name is required ")
    .trim()
    .min(3, "Min 3 characters")
    .matches(/^[a-zA-Z][a-zA-Z ]*$/, "Invalid block name"),
  code: yup
    .string()
    .required("Block code is required ")
    .trim()
    .matches(/^[A-Z]*$/, "Invalid Block code"),
  numberOfRooms: yup
    .number()
    .required("Number of room is required")
    .positive()
    .integer()
    .min(5, "Minimum 5 rooms")
    .max(20, "Maximum 20 rooms"),
});
