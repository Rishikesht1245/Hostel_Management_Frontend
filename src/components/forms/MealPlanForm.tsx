import { useState } from "react";
import Input from "./Input";
import { Form, Formik } from "formik";
import LoadingButton from "../UI/LoadingButton";
import Button from "../UI/Button";
import { toast } from "react-hot-toast";
import { mealPlanSchema } from "../../schema/staff";
import { IMealPlan } from "../../interfaces/staff";
import {
  addNewMealPlanCW,
  updateMealPlanCW,
} from "../../apiRoutes/chiefWarden";
import { addNewMealPlan, updateMealPlan } from "../../apiRoutes/staff";

const MealPlanForm = ({
  modalData,
  role,
  fetchAllMeals,
  setModalOpen,
  user,
}: Props) => {
  const [message, setMessage] = useState<string | null>(null);

  // edit or new form submission based on type of user chef or chief warden
  const submitHandler = async (formData: IMealPlan, _id?: string) => {
    if (role === "edit" && _id) {
      // warden
      if (user === "chief-warden") return updateMealPlanCW(_id, formData);
      // chef
      return updateMealPlan(_id, formData);
    } else if (role === "new") {
      if (user === "chief-warden") return addNewMealPlanCW(formData);
      return addNewMealPlan(formData);
    }
  };
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          title: modalData?.title,
          price: modalData?.price,
          breakfast: modalData?.breakfast,
          lunch: modalData?.lunch,
          evening: modalData?.evening,
          dinner: modalData?.dinner,
        }}
        validationSchema={mealPlanSchema}
        onSubmit={(formData, { setSubmitting }) => {
          setSubmitting(true);
          submitHandler(formData, modalData?._id)
            .then(({ data: { message } }: any) => {
              // function to update the table
              setModalOpen(false);
              fetchAllMeals();
              toast.success(message);
              // close modal
            })
            .catch(({ response }) => {
              if (!response?.data?.message)
                return setMessage("Something went wrong");
              return setMessage(message);
            })
            .finally(() => {
              setSubmitting(false);
              setModalOpen(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col justify-center gap-4 px-1 mb-3">
            <Input type="text" placeholder="Title" name="title" edit />
            <Input type="number" placeholder="Price" name="price" edit />
            <Input type="text" placeholder="Breakfast" name="breakfast" edit />
            <Input type="text" placeholder="Lunch" name="lunch" edit />
            <Input type="text" placeholder="Evening" name="evening" edit />
            <Input type="text" placeholder="Dinner" name="dinner" edit />
            {isSubmitting ? (
              <LoadingButton />
            ) : (
              <Button type="submit" className="max-w-sm lg:w-1/3 mx-auto">
                Save
              </Button>
            )}
          </Form>
        )}
      </Formik>
      {message && (
        <span className="text-md text-center font-semibold text-red-700">
          {message}
        </span>
      )}
    </>
  );
};

interface Props {
  modalData: IMealPlan;
  role: "new" | "edit";
  fetchAllMeals: () => any;
  setModalOpen: (state: boolean) => void;
  user: "chief-warden" | "chef";
}
export default MealPlanForm;
