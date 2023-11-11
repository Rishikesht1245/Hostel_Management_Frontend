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

export const updateComplaintSchema = yup.object().shape({
  staff: yup.string().trim().required("Staff is required"),
  status: yup
    .string()
    .trim()
    .required("Status is required")
    .oneOf(
      ["initiated", "rejected", "approval", "issued", "resolved"],
      "Invalid Complaint status"
    ),
  oldStatus: yup
    .string()
    .trim()
    .required("Status is required")
    .oneOf(
      ["initiated", "rejected", "approval", "issued", "resolved"],
      "Invalid Complaint status"
    ),
  remarks: yup
    .string()
    .trim()
    .min(4, "Remarks must be longer than 4 characters")
    .max(250, "Remarks must be shorter than 250 characters"),
});
