import { Link } from "react-router-dom";
import { staffIcon, studentIcon } from "../../assets/icons";

interface Props {
  role: "staff" | "chiefWarden" | "student";
}

const LoggedOutHeaderButton = ({ role }: Props) => {
  return (
    <Link to={role === "student" ? "/staffs/login" : "/"}>
      <div className="flex gap-6">
        <button className="header-btn">
          <img
            className="h-7 mr-1"
            src={role === "staff" ? studentIcon : staffIcon}
            alt="icon"
          />
          <span className="text-xs lg:text-base lg:block">
            {role === "student" ? "Staff" : "Student"}
          </span>
        </button>
      </div>
    </Link>
  );
};
export default LoggedOutHeaderButton;
