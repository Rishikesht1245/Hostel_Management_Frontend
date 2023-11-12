export interface INotice {
  _id?: string;
  title: string;
  message: string;
  visibility: boolean;
  audience?: {
    student: boolean;
    staff: boolean;
  };
  data?: string;
}

// New notice schema interface
export interface INewNotice {
  title: string;
  message: string;
  visibility: boolean;
  staff: boolean;
  student: boolean;
}
