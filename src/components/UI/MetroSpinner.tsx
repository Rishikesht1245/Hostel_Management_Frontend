import { MetroSpinner as Spinner } from "react-spinners-kit";

const MetroSpinner = ({
  className = "my-10",
  color = "grey",
  size = 40,
}: Props) => {
  return (
    <div className={`mx-auto ${className}`}>
      <Spinner color={color} size={size} />
    </div>
  );
};

interface Props {
  className?: string;
  color?: string;
  size?: number;
}
export default MetroSpinner;
