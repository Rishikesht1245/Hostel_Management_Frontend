import { Navigate, Outlet } from "react-router-dom";
import { getLocalData } from "../utils/localStorage";
import { studentBgImg } from "../assets/images";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

const NewStudentLayout = () => {
  const currentUser = getLocalData();
  return currentUser?.role === "student" ? (
    <Navigate to={"/students/login"} />
  ) : (
    <div
      style={{
        backgroundImage: `url(${studentBgImg})`,
        minHeight: "100vh",
        backgroundPosition: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="flex flex-col bg-[top_right_-20rem] md:bg-center bg:fixed"
    >
      <Header role="student" newAdmission />
      <div className="flex justify-center items-center grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
export default NewStudentLayout;
