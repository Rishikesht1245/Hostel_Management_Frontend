import * as yup from "yup";

// Notice Schema
export const noticeSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .trim()
    .min(5, "Title must be longer than 5 characters"),
  message: yup
    .string()
    .required("Message is required")
    .trim()
    .min(10, "Message must be longer than 10 characters")
    .max(200, "Message must be shorter than 200 characters"),
  audience: yup.object().shape({
    student: yup
      .bool()
      .required("Specify audience")
      .oneOf([true, false], "Specify audience"),
    staff: yup
      .bool()
      .required("Specify audience")
      .oneOf([true, false], "Specify audience"),
  }),
  visibility: yup.bool().oneOf([true, false], "Must be true or false"),
  date: yup.date(),
});

// New notice schema : For form
export const newNoticeSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .trim()
    .min(5, "Title must be longer than 5 characters"),
  message: yup
    .string()
    .required("Message is required")
    .trim()
    .min(10, "Message must be longer than 10 characters")
    .max(200, "Message must be shorter than 200 characters"),
  student: yup
    .bool()
    .required("Specify audience")
    .oneOf([true, false], "Specify audience"),
  staff: yup
    .bool()
    .required("Specify audience")
    .oneOf([true, false], "Specify audience"),
  visibility: yup.bool().oneOf([true, false], "Must be true or false"),
  date: yup.date(),
});
