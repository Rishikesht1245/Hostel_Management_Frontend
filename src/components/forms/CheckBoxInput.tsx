import { Field, ErrorMessage } from "formik";

interface Props {
  id: string;
  name: string;
  placeholder: string;
}

const CheckBoxInput = ({ id, name, placeholder }: Props) => {
  return (
    <div className="flex my-1 px-4 max-w-max">
      <Field
        id={id}
        name={name}
        type="checkbox"
        className="border-1 rounded-md px-4 py-2 shadow focus:outline-none w-5 h-5 accent-primary"
      />
      <label
        htmlFor={id}
        className="text-sm font-semibold mb-1 ml-2 tracking-widest text-primary"
      >
        {placeholder}
      </label>
      <span className="m-1 text-sm text-red-800">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};
export default CheckBoxInput;
