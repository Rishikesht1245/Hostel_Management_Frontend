import { Link } from "react-router-dom";
import { notFoundImg, staffBgImg, studentBgImg } from "../assets/images";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import { IRole } from "../interfaces/auth";

const NotFound = ({ role }: { role: IRole }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${
          role === "student" ? studentBgImg : staffBgImg
        })`,
        backgroundSize: "cover",
        minHeight: "100vh",
        backgroundRepeat: "no-repeat",
      }}
      className="flex flex-col md:bg-center lg:bg-fixed"
    >
      <Header role={role} />
      <div className="flex justify-center items-center grow">
        <div className="parent-container">
          <img
            src={notFoundImg}
            alt="404 not found"
            className="w-1/2 md:w-1/3 mx-auto mt-10"
          />
          <h2 className="mt-10">Oops! Page not found.</h2>
          <Link
            to={"/"}
            className="font-bold text-primary mx-auto mb-5 hover:brightness-150"
          >
            ← Back to home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default NotFound;
