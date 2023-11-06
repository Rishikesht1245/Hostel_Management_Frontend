export interface IRoom {
  number: number;
  code: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  occupiedOn: Date;
  availability: boolean;
}
export interface IBlock {
  _id: string;
  name: string;
  code: string;
  rooms: IRoom[];
  occupancy: number;
}

export interface AddBlock {
  name: string;
  code: string;
  numberOfRooms: number;
}
