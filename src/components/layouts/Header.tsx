import { Link } from "react-router-dom";
import { hostelIcon, emailIcon, mobileIcon } from "../../assets/icons";
import { useAppSelector } from "../../App";
import { ICurrentUser } from "../../interfaces/auth";
import LoggedOutHeaderButton from "../UI/LoggedOutHeaderButton";
import LoggedInHeaderButton from "../UI/LoggedInHeaderButton";
import HeaderLinks from "./HeaderLinks";

const Header = ({ role, newAdmission }: Props) => {
  const currentUser = useAppSelector<ICurrentUser | null>(
    (state) => state.currentUser
  );

  // links to show in header when user is in new admission page
  const newAdmissionLinks = (
    <div className="flex gap-5 text-sm text-primary font-black">
      <Link to={"/call"}>
        <div className="flex items-center gap-1 p-1 rounded hover:shadow-lg active:shadow-inner">
          <img className="h-6" src={mobileIcon} alt="contact" />
          <span>Contact</span>
        </div>
      </Link>
      <Link to={"/contact"}>
        <div className="flex items-center gap-1 p-1 rounded hover:shadow-lg active:shadow-inner">
          <img className="h-6" src={emailIcon} alt="email" />
          <span>Mail</span>
        </div>
      </Link>
    </div>
  );

  return (
    <header className="h-16 bg-white flex shadow-lg">
      <div className="h-16 container flex my-auto content-center justify-between gap-1 items-center">
        {/* Header Icon */}
        <Link to={"/"}>
          <span className="flex items-center gap-2">
            <img className="w-9" src={hostelIcon} alt="Hostel Management" />
            <h1 className="text-sm lg:text-base">Hostel Management</h1>
          </span>
        </Link>

        {/* Header links */}
        <div className="flex gap-7 items-center z-10">
          {/* Only display on large screens in small screens will provide this to loggedInHeaderButton */}
          <div className="hidden lg:flex gap-7">
            {/* if user is not logged in (new Admission) */}
            {newAdmission && !currentUser && newAdmissionLinks}
            {currentUser?.currentUser && (
              <HeaderLinks currentUser={currentUser} />
            )}
          </div>

          {!currentUser ? (
            <LoggedOutHeaderButton role={role} />
          ) : (
            <LoggedInHeaderButton
              currentUser={currentUser && currentUser}
              role={currentUser.role}
            >
              {currentUser?.currentUser && (
                <HeaderLinks currentUser={currentUser} />
              )}
            </LoggedInHeaderButton>
          )}
        </div>
      </div>
    </header>
  );
};

type Role = "student" | "chiefWarden" | "staff";
interface Props {
  role: Role;
  newAdmission?: boolean;
}
export default Header;
