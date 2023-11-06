import { ReactNode } from "react";

const ModalDiv = ({ children }: Props) => {
  // to keep all modal rows here
  return <div className="flex flex-col justify-center md:px-4">{children}</div>;
};

interface Props {
  children: ReactNode;
}
export default ModalDiv;
