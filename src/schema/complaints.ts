import * as yup from "yup";

// Posting new complaint by student
export const newComplaintSchema = yup.object().shape({
  department: yup
    .string()
    .trim()
    .required("Complaint department is required")
    .oneOf(["maintenance", "chef", "warden"], "Invalid complaint department"),
  message: yup
    .string()
    .trim()
    .min(10, "Message must be longer than 10 characters")
    .max(250, "Message must be shorter than 250 characters"),
});
