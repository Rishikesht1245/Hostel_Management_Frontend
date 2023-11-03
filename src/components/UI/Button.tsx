interface Props {
  type: "button" | "submit" | "reset" | undefined;
  children?: string;
  className?: string;
  onClick?: () => any;
}

const Button = ({ type, children, className, onClick }: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-primary text-white text-center rounded-md p-2 tracking-wider hover-brightness-125 hover:shadow-lg active-shadow-inner active-brightness-100 ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
