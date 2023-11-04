import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../App";
import StudentDetailsForm from "../../../components/forms/StudentDetails";
import { admissionActions } from "../../../store/AdmissionSlice";
import { addHistory } from "../../../store/HistorySlice";
const DetailsForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const admissionHandler = (formData: any) => {
    // saving filled data in store
    dispatch(admissionActions.studentDetails(formData));
    navigate("/students/admission/mealPlans");
    dispatch(addHistory(pathname));
  };

  return (
    <div className="admission-container justify-center md:w-2/3">
      <h2 className="text-lg font-extrabold mb-5"> Admission Details</h2>
      <StudentDetailsForm submitHandler={admissionHandler} />
    </div>
  );
};
export default DetailsForm;
