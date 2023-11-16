import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// pie from react chart js 2 act as bridge between chart js and react
import { Pie } from "react-chartjs-2";

// Tooltip is for showing label on hover and legend is for category wise colored data
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ className, data }: Props) => {
  const dataPreset = {
    labels: ["Pending", "Paid"],
    datasets: [
      {
        label: " ₹",
        data: data || [60, 40],
        backgroundColor: ["#e66251", "#74a533"],
        borderColor: ["rgba(255, 159, 64, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className={`${className}`}>
      <h2 className="font-extrabold text-[12px] text-slate-700">
        Payment Statistics
      </h2>
      <Pie data={dataPreset} />
    </div>
  );
};

interface Props {
  className: string;
  data: [number | undefined, number | undefined];
}
export default PieChart;
