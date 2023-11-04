import { useEffect } from "react";
import {
  admissionActions,
  fetchBlocksData,
} from "../../../store/AdmissionSlice";
import { useAppDispatch, useAppSelector } from "../../../App";
import { useNavigate } from "react-router-dom";
import { hostelImg1, hostelImg2 } from "../../../assets/images";
import MetroSpinner from "../../../components/UI/MetroSpinner";

const Blocks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const blocksData = useAppSelector(
    (state) => state?.newAdmission?.hostel?.blocks
  );

  // function to fetch the blocks data
  useEffect(() => {
    dispatch(fetchBlocksData());
  }, []);

  const blocks = blocksData?.map((block: any, i: number) => (
    <div
      key={block._id}
      className="p-4 my-2 lg:w-auto mx-3 shadow-md rounded hover:shadow-xl hover:cursor-pointer flex flex-col justify-center"
      onClick={() => {
        // saving selected block in store
        dispatch(admissionActions.addBlock(block));
        navigate("/students/admission/rooms");
      }}
    >
      {/* image and title */}
      <img
        className="w-36 m-2 hover:animate-pulse relative"
        src={i === 0 ? hostelImg1 : hostelImg2}
        alt="blocks"
      />
      <span className="mt-4 text-center font-semibold text-primary hover:brightness-125">
        {block?.name}
      </span>
    </div>
  ));

  return (
    <div className="admission-container justify-center md:w-2/3">
      <h2 className="text-lg font-extrabold mb-5">Choose a block</h2>
      {blocksData ? (
        <div className="flex justify-around">{blocks}</div>
      ) : (
        <MetroSpinner size={50} color="grey" className="my-28" />
      )}
      <button
        className="text-primary text-sm font-bold mt-5 mb-2 max-w-fit mx-auto hover:brightness-150"
        type="button"
        onClick={() => navigate("/students/admission/mealPlans")}
      >
        ← Back
      </button>
    </div>
  );
};
export default Blocks;
