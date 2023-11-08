import * as yup from "yup";

export const studentAdmissionSchema = yup.object().shape({
  email: yup.string().trim().email("Invalid email").lowercase().required(),
  name: yup
    .string()
    .required()
    .trim()
    .min(4, "Invalid student name")
    .max(20, "Invalid student name"),
  department: yup
    .string()
    .required()
    .oneOf(["science", "humanities", "commerce"], "Invalid department"),
  gender: yup.string().required().oneOf(["female", "male"], "Invalid gender"),
  password: yup
    .string()
    .trim()
    .required("Required")
    .min(6, "Invalid password")
    .max(16, "Invalid password"),
  confirmPassword: yup
    .string()
    .required("Required")
    .trim()
    .oneOf([yup.ref("password")], "Password must match"),
  mobile: yup
    .string()
    .required()
    .trim()
    .matches(/^[0-9]{10}$/, "Invalid mobile number"),
  guardianName: yup
    .string()
    .required()
    .trim()
    .min(4, "Invalid guardian name")
    .max(16, "Invalid guardian name"),
  guardianMobile: yup
    .string()
    .required()
    .trim()
    .matches(/^[0-9]{10}$/, "Invalid mobile number"),
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
  bloodGroup: yup
    .string()
    .required()
    .oneOf(
      ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      "Invalid Blood Group"
    ),
  remarks: yup
    .string()
    .trim()
    .required("Remarks is required")
    .min(4, "Remarks must be longer than 4 characters")
    .max(250, "Remarks must be shorter than 250 characters"),
});

// update student schema
export const updateStudentSchema = yup.object().shape({
  room: yup
    .string()
    .required("Room is required")
    .trim()
    .test(
      "roomCode",
      "Must be exactly 3 characters",
      (roomCode) => roomCode.length === 3
    ),
  oldRoom: yup
    .string()
    .required("Old Room is required")
    .trim()
    .test(
      "roomCode",
      "Must be exactly 3 characters",
      (roomCode) => roomCode.length === 3
    ),
  status: yup
    .string()
    .trim()
    .required("Student status is required")
    .oneOf(["resident", "rejected", "departed"], "Invalid student status"),
  oldStatus: yup
    .string()
    .trim()
    .required("Student status is required")
    .oneOf(["pending", "resident"], "Invalid student status"),
});

export const changeMealPlanSchema = yup.object().shape({
  mealPlan: yup.string().required("Meal Plan is required").trim().min(1),
});
