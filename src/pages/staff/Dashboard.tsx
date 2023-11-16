import { useCallback, useEffect, useState } from "react";
import {
  complaintsImg,
  noticeBoardImg,
  studentRisingHandImg,
} from "../../assets/images";
import Notices from "../../components/Notices";
import { toast } from "react-hot-toast";
import MetroSpinner from "../../components/UI/MetroSpinner";
import { useAppSelector } from "../../App";
import { ICurrentUser } from "../../interfaces/auth";
import { dashBoardStatisticsAPI, fetchNoticesAPI } from "../../apiRoutes/staff";

//Staff dashboard
const Dashboard = () => {
  const [dashBoardStats, setDashBoardStats] = useState<DashBoardStats | null>(
    null
  );
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const staff = useAppSelector<ICurrentUser | null>(
    (state) => state.currentUser
  );

  const fetchDashBoard = useCallback(() => {
    setLoadingStats(true);
    dashBoardStatisticsAPI()
      .then(({ data: { data } }) => setDashBoardStats(data))
      .catch(
        ({
          response: {
            data: { message },
          },
        }) => toast.error(message)
      )
      .finally(() => setLoadingStats(false));
  }, []);

  useEffect(() => {
    fetchDashBoard();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="flex flex-col md:flex-row gap-2 md:gap-10 text-white tracking-wider mb-10">
        {/* Notices stats */}
        <div className="bg-[#9B4094] rounded p-4 flex justify-between w-3/4 md:w-1/3 mx-auto">
          {!loadingStats ? (
            <div className="flex flex-col">
              <span className="text-lg font-black">
                {dashBoardStats?.[0].title}
              </span>
              <div className="flex items-end">
                <span className="text-2xl font-black" title="Occupied">
                  {dashBoardStats?.[0].count}
                </span>
                <span className="text-sm m-1 ml-2 font-black" title="Available">
                  {dashBoardStats?.[0].total}
                </span>
              </div>
            </div>
          ) : (
            <MetroSpinner color="white" className="m-3" />
          )}
          <img src={studentRisingHandImg} alt="Occupancy" className="h-16" />
        </div>

        {/* Complaints stats */}
        <div className="bg-[#e75939] rounded p-4 flex justify-between w-3/4 md:w-1/3 mx-auto">
          {!loadingStats ? (
            <div className="flex flex-col">
              <span className="text-lg font-black">
                {dashBoardStats?.[1].title}
              </span>
              <div className="flex items-end">
                <span className="text-2xl font-black" title="Occupied">
                  {dashBoardStats?.[1].count}
                </span>
                <span className="text-sm m-1 ml-2 font-black" title="Available">
                  {dashBoardStats?.[1].total}
                </span>
              </div>
            </div>
          ) : (
            <MetroSpinner color="white" className="m-3" />
          )}
          <img src={complaintsImg} alt="Occupancy" className="h-16" />
        </div>

        {/* Notice Stats */}
        <div className="bg-[#448b23] rounded p-4 flex justify-between w-3/4 md:w-1/3 mx-auto">
          {!loadingStats ? (
            <div className="flex flex-col">
              <span className="text-lg font-black">
                {dashBoardStats?.[2].title}
              </span>
              <div className="flex items-end">
                <span className="text-2xl font-black" title="Occupied">
                  {dashBoardStats?.[2].count}
                </span>
                <span className="text-sm m-1 ml-2 font-black" title="Available">
                  {dashBoardStats?.[2].total}
                </span>
              </div>
            </div>
          ) : (
            <MetroSpinner color="white" className="m-3" />
          )}
          <img src={noticeBoardImg} alt="Occupancy" className="h-16" />
        </div>
      </div>

      {/* Staff Details */}
      <div className="flex flex-col md:flex-row">
        <div className="grow flex flex-col mx-auto md:mx-0 text-center items-center p-5">
          <div className="w-1/2 md:w-32 mb-5 rounded-full border-1">
            <img
              className="rounded-full p-1"
              src={staff?.currentUser?.profilePic}
              alt="Profile pic"
            />
          </div>
          <div className="hidden md:block">
            <h1 className="normal-case">{staff?.currentUser?.name}</h1>
          </div>
          <h3 className="hidden md:block">{staff?.currentUser?.email}</h3>
          <h1 className="normal-case md:hidden">{staff?.currentUser?.name}</h1>
          <h3 className="normal-case md:hidden">
            {staff?.currentUser?.department}
          </h3>
          <h3 className="uppercase text-xs mt-1">
            {staff?.currentUser?.department}
          </h3>
        </div>
        <Notices fetchHandler={fetchNoticesAPI} className="md:w-2/3" />
      </div>
    </div>
  );
};

type DashBoardStats = [
  { title: string; count: number; total: number },
  { title: string; count: number; total: number },
  { title: string; count: number; total: number }
];

export default Dashboard;
