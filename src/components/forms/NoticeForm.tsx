import { useState } from "react";
import Input from "./Input";
import { Form, Formik } from "formik";
import LoadingButton from "../UI/LoadingButton";
import Button from "../UI/Button";
import { toast } from "react-hot-toast";
import { updateNoticeAPI, newNoticeAPI } from "../../apiRoutes/chiefWarden";
import { INewNotice, INotice } from "../../interfaces/notice";
import CheckBoxInput from "./CheckBoxInput";
import { newNoticeSchema } from "../../schema/notice";

const NoticeForm = ({
  modalData,
  role,
  fetchAllNotices,
  setModal,
}: FormProps) => {
  const [message, setMessage] = useState<string | null>(null);

  const submitHandler = async (formData: INewNotice, _id?: string) => {
    const formattedData: INotice = {
      title: formData?.title,
      message: formData?.message,
      visibility: formData?.visibility,
      audience: {
        staff: formData?.staff,
        student: formData?.student,
      },
    };

    //     edit and new notice form
    if (role === "edit" && _id) {
      return await updateNoticeAPI(_id, formattedData);
    } else if (role === "new") {
      return await newNoticeAPI(formattedData);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          title: modalData?.title,
          message: modalData?.message,
          visibility: modalData?.visibility,
          student: modalData?.audience?.student,
          staff: modalData?.audience?.staff,
        }}
        validationSchema={newNoticeSchema}
        onSubmit={(formData, { setSubmitting }) => {
          setSubmitting(true);
          submitHandler(formData as INewNotice, modalData._id)
            .then((res) => {
              fetchAllNotices();
              toast.success(res?.data?.message);
              setModal(false);
            })
            .catch(
              ({
                response: {
                  data: { message },
                },
              }) => setMessage(message)
            )
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col justify-center gap-4 px-1 mb-3">
            <Input type="text" placeholder="Title" name="title" edit />
            <Input type="text" placeholder="Message" name="message" edit />
            <div className="pb-4 border-b-2">
              <h4 className="mb-3">Audience</h4>
              <CheckBoxInput
                placeholder="Student"
                name="student"
                id="student"
              />
              <CheckBoxInput placeholder="Staff" name="staff" id="staff" />
            </div>
            <CheckBoxInput
              name="visibility"
              id="visibility"
              placeholder="Visibility"
            />
            {isSubmitting ? (
              <LoadingButton />
            ) : (
              <Button className="max-w-fit mx-auto" type="submit">
                Save
              </Button>
            )}
          </Form>
        )}
      </Formik>
      {message && (
        <span className="text-md text-red-700 font-semibold text-center">
          {message}
        </span>
      )}
    </>
  );
};
export default NoticeForm;

interface FormProps {
  modalData: INotice;
  role: "edit" | "new";
  fetchAllNotices: () => any;
  setModal: (state: boolean) => void;
}
