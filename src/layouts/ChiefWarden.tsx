import { Outlet } from "react-router-dom";
import { staffBgImg } from "../assets/images";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

const ChiefWarden = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${staffBgImg})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        backgroundRepeat: "no-repeat",
      }}
      className="flex flex-col lg:bg-fixed md:bg-center"
    >
      <Header role="chiefWarden" />
      <div className="flex justify-center items-center grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
export default ChiefWarden;
