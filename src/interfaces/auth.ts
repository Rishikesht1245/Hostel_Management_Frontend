export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  status?: string;
  data: {
    _id: string;
    email: string;
    name: string;
    mobile: string;
    department?: "maintenance" | "warden" | "chef";
  };
  token: string;
  role: "staff" | "chiefWarden" | "student";
}

export interface ICurrentUser {
  currentUser: ICurrentUserDetails;
  token: string;
  role: "staff" | "chiefWarden" | "student";
}

//  for students there will be no department
export interface ICurrentUserDetails {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  department?: "maintenance" | "chef" | "warden";
  profilePic?: string;
}

export type IRole = "student" | "staff" | "chiefWarden";
