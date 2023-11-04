import { nonVegImg, vegImg } from "../assets/images";

//  component to show the meal plans in detail
const MealPlan = ({
  data: { breakfast, dinner, lunch, evening, price, title, i },
}: Props) => {
  return (
    <div className="md:mx-4 my-4 p-4 rounded shadow-lg flex flex-col w-full">
      {/* title and image */}
      <div className="flex">
        <div className="flex flex-col text-center items-center grow">
          <h3 className="text-lg text-primary text-center grow font-bold">
            {title}
          </h3>
          <span className="text-md text-primary font-bold">
            ₹ {price} / Month
          </span>
        </div>
        <img
          src={i === 0 ? vegImg : nonVegImg}
          alt="meal plan"
          className="w-20 mx-4"
        />
      </div>
      {/* meal plans details */}
      <div className="flex flex-col bg-[#fffefe] rounded-lg py-8 px-4 mt-6 shadow-md">
        {/* breakfast */}
        <div className="mb-7">
          <div className="flex justify-between font-bold text-black">
            <h4>Breakfast</h4>
            <h4>07 : 00 - 09 : 00 AM</h4>
          </div>
          <p>{breakfast}</p>
        </div>

        {/* lunch */}
        <div className="mb-7">
          <div className="flex justify-between font-bold text-black">
            <h4>Lunch</h4>
            <h4>12 : 30 - 01 : 30 PM</h4>
          </div>
          <p>{lunch}</p>
        </div>
        {/* Evening */}
        <div className="mb-7">
          <div className="flex justify-between font-bold text-black">
            <h4>Evening</h4>
            <h4>04 : 30 - 05 : 30 PM</h4>
          </div>
          <p>{evening}</p>
        </div>
        {/* dinner */}
        <div className="mb-7">
          <div className="flex justify-between font-bold text-black">
            <h4>Dinner</h4>
            <h4>08 : 00 - 09 : 30 PM</h4>
          </div>
          <p>{dinner}</p>
        </div>
      </div>
    </div>
  );
};

interface Props {
  data: {
    active?: boolean;
    breakfast: string;
    lunch: string;
    evening: string;
    dinner: string;
    price: number;
    subscribers: number;
    title: string;
    updatedAt: string;
    _id: string;
    selected?: boolean;
    i: number;
  };
}
export default MealPlan;
