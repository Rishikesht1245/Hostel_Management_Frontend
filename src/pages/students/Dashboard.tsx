import { useEffect, useState } from "react";
import Notices from "../../components/Notices";
import toast from "react-hot-toast";
import { IMealPlanResponse } from "../../interfaces/student";
import { useAppSelector } from "../../App";
import { ICurrentUser } from "../../interfaces/auth";
import MetroSpinner from "../../components/UI/MetroSpinner";
import { fetchMealPlanAPI, fetchNoticesAPI } from "../../apiRoutes/student";

const Dashboard = () => {
  const [mealPlan, setMealPlan] = useState<IMealPlanResponse | null>(null);
  const student = useAppSelector<ICurrentUser | null>(
    (state) => state.currentUser
  );
  const [mealPlanLoading, setMealPlanLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMealPlanAPI()
      .then(({ data: { data } }) => setMealPlan(data))
      .catch(
        ({
          response: {
            data: { message },
          },
        }) => toast.error(message)
      )
      .finally(() => setMealPlanLoading(false));
  }, []);
  return (
    <div className="student-dashboard-container justify-between  md:gap-5">
      <div className="mx-auto md:w-1/3 md:mx-0 border-b-2 pb-3 md:pb-0 md:border-none">
        <Notices fetchHandler={fetchNoticesAPI} />
      </div>
      <div className="flex flex-col mx-auto md:mx-0 text-center items-center">
        <div className="w-2/3 md:w-32 mb-5 rounded-full border-1 mx-auto">
          <img
            src={student?.currentUser?.profilePic}
            alt="Profile pic"
            className="rounded-full"
          />
        </div>
        <h1 className="normal-case text-center">
          {student?.currentUser?.name}
        </h1>
      </div>
      <div className="md:w-[400px] mx-auto md:mx-0">
        <h4 className="text-black pb-1 border-b border-[#B1B1b1] mb-7">
          Today's Meal
        </h4>
        {!mealPlanLoading ? (
          <>
            <div className="mb-7">
              <div className="flex justify-between font-bold text-black">
                <h4>Breakfast</h4>
                <h4>07 : 00 - 09 : 00 AM</h4>
              </div>
              <p className="text-sm mt-3 tracking-wide text-[#2B2B2B]">
                {mealPlan?.breakfast}
              </p>
            </div>
            <div className="mb-7">
              <div className="flex justify-between font-bold text-black">
                <h4>Lunch</h4>
                <h4>12 : 30 - 01 : 30 PM</h4>
              </div>
              <p className="text-sm mt-3 tracking-wide text-[#2B2B2B]">
                {mealPlan?.lunch}
              </p>
            </div>
            <div className="mb-7">
              <div className="flex justify-between font-bold text-black">
                <h4>Evening</h4>
                <h4>04 : 30 - 05 : 30 PM</h4>
              </div>
              <p className="text-sm mt-3 tracking-wide text-[#2B2B2B]">
                {mealPlan?.evening}
              </p>
            </div>
            <div className="mb-7">
              <div className="flex justify-between font-bold text-black">
                <h4>Dinner</h4>
                <h4>08 : 00 - 09 : 30 PM</h4>
              </div>
              <p className="text-sm mt-3 tracking-wide text-[#2B2B2B]">
                {mealPlan?.dinner}
              </p>
            </div>
          </>
        ) : (
          <MetroSpinner className="my-28" />
        )}
      </div>
    </div>
  );
};
export default Dashboard;
