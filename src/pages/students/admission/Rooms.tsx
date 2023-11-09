import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../App";
import { customPopup } from "../../../utils/popup";
import { admissionActions } from "../../../store/AdmissionSlice";
import { newAdmissionAPI } from "../../../apiRoutes/student";

const Rooms = () => {
  const selectedBlock = useAppSelector(
    (state) => state.newAdmission?.hostel?.selectedBlock
  );
  const studentData = useAppSelector((state) => state.newAdmission?.student);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectRoomHandler = (code: string) => {
    // room confirmation
    customPopup
      .fire({
        html: `Confirm room <h1>${code}</h1>`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      })
      .then((result) => {
        // admission confirmation
        if (result?.isConfirmed) {
          return customPopup.fire({
            title: "Confirm Admission",
            icon: "question",
            scrollbarPadding: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          });
        }
      })
      .then(async (result) => {
        // posting data to server
        if (result?.isConfirmed) {
          const { building, city, pin, state, country } = studentData;
          const formData = {
            ...studentData,
            // adding address field as per DB
            address: { building, city, pin, state, country },
            // adding room field as per DB
            room: code,
          };
          try {
            await newAdmissionAPI(formData);
            //     clearing data stored in redux store
            dispatch(admissionActions.complete());
            return customPopup
              .fire({
                title: "Applied Successfully",
                icon: "success",
                text: "Once admitted, the chief warden will contact you through your school email",
                confirmButtonText: "Sure!",
                confirmButtonColor: "#00A300",
              })
              .then((result) => {
                if (result?.isConfirmed) {
                  navigate("/");
                }
              });
          } catch (error: any) {
            console.log(error);
            setErrorMessage(error?.response?.data?.message);
          }
        }
      });
  };
  return (
    <div className="parent-container">
      <h2 className="text-lg font-extrabold mb-5">Select a Room</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 m-4">
        {selectedBlock?.rooms?.map((room: any) => (
          <div
            key={room.code}
            onClick={() => selectRoomHandler(room.code)}
            className={`${!room.availability && "bg-red-400"} ${
              !room.availability
                ? "hover:cursor-not-allowed"
                : "hover:cursor-pointer"
            } font-semibold tracking-wider text-primary m-3 text-center shadow rounded py-3 hover:shadow-lg active:brightness-125`}
          >
            <span>{room.code}</span>
          </div>
        ))}
      </div>
      <button
        className="text-primary text-sm font-bold mt-5 mb-2 max-w-fit mx-auto hover:brightness-150"
        type="button"
        onClick={() => navigate("/students/admission/blocks")}
      >
        ← Back
      </button>
      {errorMessage && (
        <span className="text-md text-center font-semibold text-red-700">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
export default Rooms;
