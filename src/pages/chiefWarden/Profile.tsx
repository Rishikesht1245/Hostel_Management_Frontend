import { Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "react-hot-toast";
import PasswordInput from "../../components/forms/PasswordInput";
import LoadingButton from "../../components/UI/LoadingButton";
import Button from "../../components/UI/Button";
import { resetPasswordSchema } from "../../schema/auth";
import { resetPasswordAPI } from "../../apiRoutes/chiefWarden";
import { useAppSelector } from "../../App";
import { ICurrentUser } from "../../interfaces/auth";
import { defaultAvatarImg } from "../../assets/images";

const Profile = () => {
  const [message, setMessage] = useState<string | null>(null);
  const chiefWardenData = useAppSelector<ICurrentUser | null>(
    (state) => state.currentUser
  );

  return (
    <div className="profile-container">
      <div className="flex flex-col mx-auto md:mx-0 text-center justify-center p-5 border-b-2 border-bg-gray-400 lg:border-r md:border-r-gray-400">
        <div className="w-32 mb-5 rounded-full border-1 mx-auto">
          <img src={defaultAvatarImg} alt="Chief warden avatar" />
        </div>
        <div className="hidden md:block mb-2 ">
          <h1 className="normal-case">{chiefWardenData?.currentUser?.name}</h1>
        </div>
        <h1 className="md:hidden normal-case">
          {chiefWardenData?.currentUser?.name}
        </h1>
        <h3>Chief Warden</h3>
      </div>
      <div className="flex flex-col my-4 px-5 grow">
        <div className="flex flex-col md:flex-row justify-between gap-2 pb-3 border-b border-b-gray-400 ">
          <div>
            <h4>Mail</h4>
            <p className="text-sm">{chiefWardenData?.currentUser?.email}</p>
          </div>
          <div>
            <h4>Mobile</h4>
            <p className="text-sm">{chiefWardenData?.currentUser?.mobile}</p>
          </div>
        </div>
        {/* Change password */}
        <div className="flex flex-col items-center">
          <h4 className="mt-5 uppercase">Change Password</h4>
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={resetPasswordSchema}
            onSubmit={(formData, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              resetPasswordAPI(formData)
                .then(({ data: { message } }) => {
                  toast.success(message);
                  resetForm();
                  setMessage(null);
                })
                .catch(
                  ({
                    response: {
                      data: { message },
                    },
                  }) => {
                    return setMessage(message);
                  }
                )
                .finally(() => setSubmitting(false));
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col justify-center gap-2 px-1 mb-3 text-sm mt-5">
                <PasswordInput
                  placeholder="Current password"
                  name="currentPassword"
                  id="currentPassword"
                />
                <PasswordInput
                  placeholder="New password"
                  name="newPassword"
                  id="newPassword"
                />
                <PasswordInput
                  placeholder="Confirm password"
                  name="confirmPassword"
                  id="confirmPassword"
                />

                {isSubmitting ? (
                  <LoadingButton />
                ) : (
                  <Button type="submit">Reset Password</Button>
                )}
              </Form>
            )}
          </Formik>
          {message && (
            <span
              className="text-md text-red-700 text-center font-semibold
            "
            >
              {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;
