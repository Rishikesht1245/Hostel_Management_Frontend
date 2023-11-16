import {
  Chart as ChartJS,
  CategoryScale, // non-numeric data
  LinearScale, // cale used for numeric data
  PointElement, // represents individual data points in the chart
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Monthly Payments",
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const LineChart = ({ className, data }: Props) => {
  const formattedData = {
    labels,
    datasets: [
      // y -axis
      {
        //label for legend
        label: "Revenue",
        data: data[0] || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      // x -axis
      {
        label: "No. of payments",
        data: data[1] || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return (
    <div className={className}>
      <Line options={options} data={formattedData} />
    </div>
  );
};
interface Props {
  className: string;
  //   total payments and no revenue
  data: [number[] | undefined, number[] | undefined];
}
export default LineChart;
