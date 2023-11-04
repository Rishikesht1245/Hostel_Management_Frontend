import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../App";
import MealPlan from "../../../components/MealPlan";
import {
  admissionActions,
  fetchActiveMealPlans,
} from "../../../store/AdmissionSlice";
import { useEffect } from "react";
import { Form, Formik } from "formik";
import SelectInput from "../../../components/forms/SelectInput";
import LoadingButton from "../../../components/UI/LoadingButton";
import Button from "../../../components/UI/Button";
import { changeMealPlanSchema } from "../../../schema/student";
import MetroSpinner from "../../../components/UI/MetroSpinner";

const MealPlans = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //   after the useEffect the state will get value
  const activePlans = useAppSelector(
    (state) => state?.newAdmission?.hostel?.mealPlans
  );

  //   async thunk function to fetch active plans
  useEffect(() => {
    dispatch(fetchActiveMealPlans());
  }, []);

  //   submit handler
  const submitHandler = (formData: { mealPlan: string }) => {
    dispatch(admissionActions.addMealPlan(formData.mealPlan));
    navigate("/students/admission/blocks");
  };

  const options = activePlans?.map((item: any) => {
    return { value: item._id, text: item.title };
  });

  return (
    <div className="mealPlans-container lg:w-2/3">
      <h1 className="text-center my-3 text-lg">Select a meal plan</h1>
      <div className="flex flex-col md:flex-row lg:justify-around">
        {activePlans ? (
          activePlans?.map((mealPlan: any, i: number) => (
            <MealPlan key={mealPlan._id} data={{ ...mealPlan, i }} />
          ))
        ) : (
          <MetroSpinner size={50} color="grey" className="my-36" />
        )}
      </div>
      <Formik
        initialValues={{ mealPlan: "" }}
        validationSchema={changeMealPlanSchema}
        onSubmit={(FormData, { setSubmitting }) => {
          setSubmitting(true);
          submitHandler(FormData);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex mt-4 justify-center gap-4 px-1 mb-3">
            <SelectInput
              options={options}
              label="Choose a meal plan"
              name="mealPlan"
            />
            {isSubmitting ? (
              <LoadingButton />
            ) : (
              <Button type="submit" className="max-h-fit px-4">
                Save and Continue
              </Button>
            )}
          </Form>
        )}
      </Formik>
      <button
        className="text-primary text-sm font-bold mt-5 mb-2 max-w-fit mx-auto hover:brightness-15"
        type="button"
        onClick={() => {
          navigate("/students/admission/details");
        }}
      >
        ← Back
      </button>
    </div>
  );
};
export default MealPlans;
