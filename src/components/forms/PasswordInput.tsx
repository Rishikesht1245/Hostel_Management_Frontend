import { Field, ErrorMessage } from "formik";
import { blockedEye, openEye } from "../../assets/icons";
import { useState } from "react";

const PasswordInput = ({ id, name, placeholder, edit }: Props) => {
  const [toggle, setToggle] = useState<boolean>(false);
  return (
    <div className="flex flex-col w-full">
      {edit && (
        <label
          htmlFor={name}
          className="text-sm font-semibold mb-1 ml-1 tracking-widest text-primary"
        >
          {placeholder}
        </label>
      )}
      <div className="flex justify-between relative items-center rounded-md px-4 py-2 shadow w-full">
        <Field
          className="outline-none w-full"
          id={id}
          name={name}
          placeholder={placeholder}
          type={toggle ? "text" : "password"}
        />
        <img
          className="h-5 w-5"
          src={toggle ? blockedEye : openEye}
          alt="showOrHide"
          onClick={(): void => {
            setToggle((prev) => !prev);
          }}
        />
      </div>
      <span className="m-1 text-sm font-medium text-red-800">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};

interface Props {
  id: string;
  name: string;
  placeholder: string;
  edit?: boolean;
}
export default PasswordInput;
