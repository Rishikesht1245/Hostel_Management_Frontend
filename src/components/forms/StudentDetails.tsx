import { Form, Formik } from "formik";
import { useMemo } from "react";
import LoadingButton from "../UI/LoadingButton";
import Button from "../UI/Button";
import Input from "./Input";
import PasswordInput from "./PasswordInput";
import SelectInput from "./SelectInput";
import { studentAdmissionSchema } from "../../schema/student";
import { useAppSelector } from "../../App";

// student data is the state where data is saved
const StudentDetails = ({ studentData, submitHandler }: Props) => {
  if (!studentData) {
    studentData = useAppSelector((state) => state.newAdmission);
  }

  // useMemo hook is used -- it memoize the result of a function here the arrays are memoized
  // options for select Input
  const departmentOptions = useMemo(
    () => [
      {
        text: "Science",
        value: "science",
      },
      {
        text: "Commerce",
        value: "commerce",
      },
      {
        text: "Humanities",
        value: "humanities",
      },
    ],
    // dependency array
    []
  );

  const genderOptions = useMemo(
    () => [
      {
        text: "Male",
        value: "male",
      },
      {
        text: "Female",
        value: "female",
      },
    ],
    []
  );

  const bloodGroupOptions = useMemo(
    () => [
      {
        text: "A+",
        value: "A+",
      },
      {
        text: "A-",
        value: "A-",
      },
      {
        text: "B+",
        value: "B+",
      },
      {
        text: "AB+",
        value: "AB+",
      },
      {
        text: "AB-",
        value: "AB-",
      },
      {
        text: "B-",
        value: "B-",
      },
      {
        text: "O+",
        value: "O+",
      },
      {
        text: "O-",
        value: "O-",
      },
    ],
    []
  );

  return (
    <>
      <Formik
        enableReinitialize
        // for edit studentData is used (edit form) otherwise admission form
        initialValues={{
          email: studentData?.email || "",
          name: studentData?.name || "",
          department: studentData?.department || "",
          gender: studentData?.gender || "",
          password: studentData?.password || "",
          confirmPassword: studentData?.confirmPassword || "",
          mobile: studentData?.mobile || "",
          guardianName: studentData?.guardianName || "",
          guardianMobile: studentData?.guardianMobile || "",
          building: studentData?.building || "",
          city: studentData?.city || "",
          pin: studentData?.pin || "",
          state: studentData?.state || "",
          country: studentData?.country || "",
          bloodGroup: studentData?.bloodGroup || "",
          remarks: studentData?.remarks || "",
        }}
        validationSchema={studentAdmissionSchema}
        onSubmit={(formData, { setSubmitting }) => {
          setSubmitting(true);
          submitHandler(formData);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="m-2 text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-2 lg:gap-8 lg:mx-10">
            <Input
              type="email"
              placeholder="School mail"
              // md full width and lg 1 column
              className="md:col-span-full lg:col-span-1"
              name="email"
            />
            <Input type="text" placeholder="Name" name="name" />
            <SelectInput
              name="department"
              label="Department"
              options={departmentOptions}
            />
            <SelectInput name="gender" label="Gender" options={genderOptions} />
            <PasswordInput
              placeholder="Password"
              name="password"
              id="password"
            />
            <PasswordInput
              placeholder="Confirm password"
              name="confirmPassword"
              id="confirmPassword"
            />
            <Input type="number" placeholder="Mobile" name="mobile" />
            <Input
              type="text"
              placeholder="Guardian Name"
              name="guardianName"
            />
            <Input
              type="number"
              placeholder="Guardian Mobile"
              name="guardianMobile"
            />
            <Input type="text" placeholder="Building Name/No" name="building" />
            <Input type="text" placeholder="City" name="city" />
            <Input type="number" placeholder="Pin" name="pin" />
            <Input type="text" placeholder="State" name="state" />
            <Input type="text" placeholder="Country" name="country" />
            <SelectInput
              name="bloodGroup"
              label="Blood Group"
              options={bloodGroupOptions}
            />
            <Input
              type="text"
              className="col-span-full"
              placeholder="Remarks"
              name="remarks"
            />
            <div className="col-span-full flex justify-center">
              {isSubmitting ? (
                <LoadingButton className="w-1/3" />
              ) : (
                <Button className="mx-auto px-4" type="submit">
                  Save and Continue
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

interface Props {
  studentData?: any;
  submitHandler?: any;
}
export default StudentDetails;
