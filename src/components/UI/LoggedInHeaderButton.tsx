import { Link } from "react-router-dom";
import { ICurrentUser } from "../../interfaces/auth";
import { currentUserActions } from "../../store/currentUserSlice";
import { useAppDispatch } from "../../App";
import { useEffect, useState, ReactNode } from "react";
import { defaultAvatarImg } from "../../assets/images";
import { toast } from "react-hot-toast";

const LoggedInHeaderButton = ({ children, currentUser, role }: Props) => {
  const dispatch = useAppDispatch();
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [route, setRoute] = useState<
    "students" | "staffs" | "chief-wardens" | ""
  >("");

  //   function to set the route
  useEffect(() => {
    switch (role) {
      case "staff":
        setRoute("staffs");
        break;
      case "student":
        setRoute("students");
        break;
      case "chiefWarden":
        setRoute("chief-wardens");
    }
  }, []);
  return (
    <div className="group">
      {/* visible only on large screens */}
      <div className="hidden lg:block">
        {/* logout button visible on hover*/}
        <Link
          to={route === "students" ? "/" : `/${route}/login`}
          onClick={() => {
            dispatch(currentUserActions.logout());
            return toast.success("Logged out", {
              style: { background: "rgb(0,0,0,0.9)", color: "white" },
            });
          }}
          //     while hovering the group then only logout will be visible
          className="invisible px-4 py-2 bg-white rounded-md border-1 text-primary shadow-lg hover:brightness-90 text-sm font-black group-hover:visible absolute z-10 right-9"
        >
          Logout
        </Link>
        <Link className="relative" to={`/${route}/profile`}>
          <div className="flex gap-6">
            <button className="header-btn">
              <img
                className="h-7 rounded-sm mr-7"
                src={currentUser?.currentUser?.profilePic || defaultAvatarImg}
                alt="Profile image"
              />
              {/* user name display only in large screens */}
              <span className="text-xs hidden lg:text-sm lg:block">
                {currentUser?.currentUser?.name.split(" ")[0]}
              </span>
            </button>
          </div>
        </Link>
      </div>
      {/* for small devices */}
      <div
        className="lg:hidden relative hover:brightness-100"
        onClick={() => setDropdown((prev) => !prev)}
      >
        <img
          className="h-7 mr-1 rounded-full"
          src={currentUser?.currentUser?.profilePic || defaultAvatarImg}
          alt="Profile image"
        />
        {/* drop down */}
        <div
          className={`${
            dropdown ? "hidden" : ""
          } flex flex-col gap-2 absolute top-8 right-2 shadow-xl border-1 z-10 bg-white p-3 text-sm text-primary font-black rounded-md`}
        >
          {children}
          <Link to={`/${route}/profile`}>Profile</Link>
          <Link
            to={`/${route}/login`}
            onClick={() => {
              toast.success("Logged out", {
                style: { background: "rgba(0,0,0,0.9)", color: "white" },
              });
              return dispatch(currentUserActions.logout());
            }}
            className="border-t-2 pt-1 text-red-700"
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

interface Props {
  children?: ReactNode;
  currentUser: ICurrentUser;
  role: "staff" | "student" | "chiefWarden";
}

export default LoggedInHeaderButton;
