import { useEffect, useState } from "react";
import {
  complaintsImg,
  noticeBoardImg,
  studentRisingHandImg,
} from "../../assets/images";
import {
  complaintStatisticsAPI,
  noticeStatisticsAPI,
  occupancyStatisticsAPI,
  paymentStatisticsAPI,
  yearlyRevenueAPI,
} from "../../apiRoutes/chiefWarden";
import PieChart from "../../components/PieChart";
import LineChart from "../../components/LineChart";
import MetroSpinner from "../../components/UI/MetroSpinner";

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  // active notices and all notices as array elements
  const [noticeStatistics, setNoticeStatistics] = useState<number[]>([0, 0]);
  const [paymentStatistics, setPaymentStatistics] = useState<{
    paid: number;
    pending: number;
  } | null>(null);
  const [hostelOccupancy, setHostelOccupancy] = useState<{
    occupancy: number;
    totalRooms: number;
    availableRooms: number;
  } | null>(null);
  const [complaintStatistics, setComplaintStatistics] = useState<{
    count: number;
    total: number;
  } | null>(null);
  const [yearlyRevenue, setYearlyRevenue] = useState<
    {
      month: number;
      totalPayments: number;
      revenue: number;
    }[]
  >([]);

  // fetching all datas
  useEffect(() => {
    // Promise.allSettled the results for all the resolved and rejected promises as an aggregated array of objects
    // with (status, and value) for all the resolved promises and status and reason for the rejected promises
    Promise.allSettled([
      noticeStatisticsAPI(),
      paymentStatisticsAPI(),
      yearlyRevenueAPI(),
      complaintStatisticsAPI(),
      occupancyStatisticsAPI(),
    ])
      .then((results) => {
        // extracting the data and updating the state
        results.forEach((result, i) => {
          if (!result) throw new Error();
          if (result.status === "fulfilled" && result.value) {
            const {
              data: { data },
            }: any = result.value; // result .value contains the response object
            if (i === 0) {
              setNoticeStatistics(data);
              console.log(data);
            }
            if (i === 1) setPaymentStatistics(data);
            if (i === 2) setYearlyRevenue(data);
            if (i === 3) setComplaintStatistics(data);
            if (i === 4) setHostelOccupancy(data);
          } else {
            console.log("Error loading the statistics");
          }
        });
      })
      .catch((error) => {
        console.log("Error Loading statistics", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="flex flex-col md:flex-row gap-2 md:gap-10 text-white tracking-wider mb-10">
        {/* Occupancy Box */}
        <div className="rounded bg-[#423ab1] p-4 flex justify-between w-3/4 mx-auto md:w-1/3">
          <div className="flex flex-col">
            <span className="text-lg font-black">Occupancy</span>
            {loading ? (
              <MetroSpinner color="white" size={30} className="mx-0 mt-2" />
            ) : (
              <div className="flex items-end">
                <span className="text-2xl font-black" title="Occupied">
                  {hostelOccupancy?.occupancy || 0}
                </span>
                <span className="text-sm m-1 ml-2" title="Available">
                  {hostelOccupancy?.availableRooms || 0}
                </span>
                <span className="text-sm m-1" title="Total">
                  {hostelOccupancy?.totalRooms || 0}
                </span>
              </div>
            )}
          </div>
          <img src={studentRisingHandImg} className="h-16" alt="attendance" />
        </div>
        {/* Complaints box */}
        <div className="bg-[#e66251] rounded p-4 flex justify-between w-3/4 mx-auto md:w-1/3">
          <div className="flex flex-col">
            <span className="text-lg font-black">Complaints</span>
            {loading ? (
              <MetroSpinner color="white" size={30} className="mx-0 mt-2" />
            ) : (
              <div className="flex items-end">
                <span className="text-2xl font-black" title="Resolved">
                  {complaintStatistics?.count || 0}
                </span>
                <span className="text-sm m-1 ml-2" title="Total">
                  {complaintStatistics?.total || 0}
                </span>
              </div>
            )}
          </div>
          <img src={complaintsImg} className="h-16" alt="complaints" />
        </div>

        {/* Notices  box */}
        <div className="bg-[#74a533] rounded p-4 flex justify-between w-3/4 mx-auto md:w-1/3">
          <div className="flex flex-col">
            <span className="text-lg font-black">Notices</span>
            {loading ? (
              <MetroSpinner color="white" size={30} className="mx-0 mt-2" />
            ) : (
              <div className="flex items-end">
                <span className="text-2xl font-black" title="Total">
                  {noticeStatistics[0]}
                </span>
                <span className="text-sm m-1 ml-2" title="Active">
                  {noticeStatistics[1]}
                </span>
              </div>
            )}
          </div>
          <img src={noticeBoardImg} className="h-16" alt="notices" />
        </div>
      </div>
      {/* Charts */}
      <div className="flex flex-col md:flex-row mb-2">
        <LineChart
          className="md:w-2/3"
          data={[
            // nested arrays for x axis and y axis
            yearlyRevenue?.map((month) => month.revenue),
            yearlyRevenue?.map((month) => month.totalPayments),
          ]}
        />
        <PieChart
          className="md:w-1/3"
          data={[paymentStatistics?.pending, paymentStatistics?.paid]}
        />
      </div>
    </div>
  );
};
export default Dashboard;
