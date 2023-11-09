import MealPlan from "../../components/MealPlan";
import { useCallback, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import SelectInput from "../../components/forms/SelectInput";
import LoadingButton from "../../components/UI/LoadingButton";
import Button from "../../components/UI/Button";
import { changeMealPlanSchema } from "../../schema/student";
import {
  fetchActiveMealPlansAPI,
  selectedMealPlanAPI,
  updateMealPlanAPI,
} from "../../apiRoutes/student";
import { toast } from "react-hot-toast";
import MetroSpinner from "../../components/UI/MetroSpinner";

const MealPlans = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [activePlans, setActivePlans] = useState<any>([]);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMealPlans = useCallback(() => {
    fetchActiveMealPlansAPI()
      .then(({ data: { data } }) => {
        setActivePlans(data);
        // returning another promise from one promise (Promise chaining)
        return selectedMealPlanAPI();
      })
      .then(({ data: { data } }) => {
        setCurrentPlan(data);
      })
      .catch(
        ({
          response: {
            data: { message },
          },
        }) => toast.error(message)
      )
      .finally(() => setLoading(false));
  }, []);

  //   fetching current plan and all active meal plans
  useEffect(() => {
    fetchMealPlans();
  }, []);

  //   submit handler for form update
  const submitHandler = (formData: { mealPlan: string }) => {
    // assigning the promise return to a variable so that it can used as promise in toast
    const updateMealPlan = updateMealPlanAPI(formData).then(
      ({ data: { data } }) => {
        setCurrentPlan(data);
      }
    );
    toast.promise(updateMealPlan, {
      loading: "Updating meal plan",
      success: "Meal plan updated",
      error: "Please try again",
    });
    return updateMealPlan;
  };

  let options =
    activePlans &&
    activePlans?.map((el: any) => {
      if (currentPlan?._id !== el._id) return { value: el._id, text: el.title };
      else return false;
    });

  return (
    <div className="mealPlans-container lg:w-2/3">
      <h1 className="text-center my-3 text-lg">Select a meal plan</h1>
      {!loading ? (
        <div className="flex flex-col md:flex-row lg:justify-around">
          {activePlans?.map((mealPlan: any, i: number) => (
            <MealPlan key={mealPlan._id} data={{ ...mealPlan, i }} />
          ))}
        </div>
      ) : (
        <MetroSpinner className="my-36" />
      )}
      <Formik
        initialValues={{ mealPlan: "" }}
        validationSchema={changeMealPlanSchema}
        onSubmit={(formData, { setSubmitting }) => {
          setSubmitting(true);
          setMessage(null);
          submitHandler(formData)
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
          <Form className="flex mt-4 justify-center gap-4 px-1 mb-3">
            <SelectInput
              // filtering falsy values out
              options={options.filter((item: any) => item)}
              label="Choose a meal plan"
              name="mealPlan"
            />
            {isSubmitting ? (
              <LoadingButton />
            ) : (
              <Button type="submit" className="max-w-fit px-4">
                Save
              </Button>
            )}
          </Form>
        )}
      </Formik>
      {message && (
        <span className="text-center text-md font-semibold text-red-700">
          {message}
        </span>
      )}
    </div>
  );
};
export default MealPlans;
