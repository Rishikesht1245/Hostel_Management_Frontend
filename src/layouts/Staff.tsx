import { Outlet } from "react-router-dom";
import { staffBgImg } from "../assets/images";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

const Staff = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${staffBgImg})`,
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="flex flex-col md:bg-center lg:bg-fixed"
    >
      <Header role="staff" />
      <div className="flex justify-center items-center grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
export default Staff;
