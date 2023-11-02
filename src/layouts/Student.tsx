import { studentBgImg } from "../assets/images";

const Student = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${studentBgImg})`,
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
};
export default Student;
