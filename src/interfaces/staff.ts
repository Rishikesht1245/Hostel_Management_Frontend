export interface IMealPlan {
  title: string;
  price: string;
  breakfast: string;
  lunch: string;
  evening: string;
  dinner: string;
  _id?: string;
}

export interface IStaff {
  _id: string;
  name: string;
  email: string;
  password: string;
  mobile: number;
  role: "warden" | "chef" | "maintenance";
  gender: "female" | "male";
  profilePic?: string;
  address: IStaffAddress;
}

export interface IStaffAddress {
  building: string;
  city: string;
  pin: number;
  state: string;
  country: string;
}
