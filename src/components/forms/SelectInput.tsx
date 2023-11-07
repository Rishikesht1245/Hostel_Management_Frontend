import { ErrorMessage, Field } from "formik";

const SelectInput = ({
  name,
  options,
  className,
  label,
  defaultValue,
  edit,
}: Props) => {
  return (
    <div>
      {edit && label && (
        <label
          htmlFor={name}
          className="text-sm font-semibold mb-1 ml-1 tracking-widest text-primary"
        >
          {label}
        </label>
      )}
      <div className={`${className} flex flex-col`}>
        <Field
          as="select"
          name={name}
          id={name}
          className={`${className} text-gray-400 rounded-md px-4 py-2 shadow focus:outline-none w-full`}
        >
          {/* options as array */}[
          {
            <option key={"default"} value={defaultValue ? defaultValue : ""}>
              {defaultValue ? defaultValue : label}
            </option>
          }
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
          ]
        </Field>
        <span className="m-1 text-sm font-medium text-red-800">
          <ErrorMessage name={name} />
        </span>
      </div>
    </div>
  );
};

interface Props {
  name: string;
  options: { value: string; text: string }[];
  className?: string;
  label: string;
  defaultValue?: string;
  edit?: boolean;
}
export default SelectInput;
