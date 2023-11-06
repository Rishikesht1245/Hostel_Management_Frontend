import { useState } from "react";
import { Form, Formik } from "formik";
import { blockSchema } from "../../schema/block";
import Input from "./Input";
import Button from "../UI/Button";
import LoadingButton from "../UI/LoadingButton";
import { addNewBlockCW } from "../../apiRoutes/chiefWarden";
import toast from "react-hot-toast";

const BlockForm = ({ fetchAllBlocks, setModalOpen }: Props) => {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <>
      <Formik
        initialValues={{ name: "", code: "", numberOfRooms: 0 }}
        validationSchema={blockSchema}
        onSubmit={(formData, { setSubmitting }) => {
          setSubmitting(true);
          addNewBlockCW(formData)
            .then(({ data: { message } }) => {
              setModalOpen(false);
              fetchAllBlocks();
              toast.success(message);
            })
            .catch(({ response }) => {
              if (!response?.data?.message)
                return setMessage("Something went wrong");
              return setMessage(response?.data?.message);
            })
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col justify-center gap-4 px-1 mb-3">
            <Input type="text" placeholder="Name" edit name="name" />
            <Input type="text" placeholder="Code" edit name="code" />
            <Input
              type="number"
              placeholder="Number of rooms"
              edit
              name="numberOfRooms"
            />
            {isSubmitting ? (
              <LoadingButton />
            ) : (
              <Button type="submit" className="max-w-sm lg:w-1/2 mx-auto">
                Save
              </Button>
            )}
          </Form>
        )}
      </Formik>
      {message && (
        <span className="text-md text-center font-semibold text-red-700 mx-auto">
          {message}
        </span>
      )}
    </>
  );
};

interface Props {
  fetchAllBlocks: () => any;
  setModalOpen: (state: boolean) => void;
}
export default BlockForm;
