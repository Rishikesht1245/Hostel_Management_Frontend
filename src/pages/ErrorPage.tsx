import { Link } from "react-router-dom";
import { errorImg, studentBgImg } from "../assets/images";
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";

function ErrorPage() {
  return (
    <div
      style={{
        backgroundImage: `url(${studentBgImg})`,
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="flex flex-col bg-[top_right_-20rem] md:bg-center bg-fixed"
    >
      <Header role="student" />
      <div className="flex justify-center items-center grow">
        <div className="parent-container py-5">
          <img
            className="w-1/2 md:w-1/3 mx-auto mt-10"
            src={errorImg}
            alt="something went wrong"
          />
          <h2 className="mt-10">Oops! Something went wrong.</h2>
          <Link className="font-bold text-primary mx-auto my-5" to={"/"}>
            ← Back to home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ErrorPage;
