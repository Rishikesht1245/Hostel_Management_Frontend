const LoadingButton = (props: Props) => {
  return (
    <button
      type="button"
      className={`bg-primary text-white text-center rounded-md p-2 flex justify-center ${props?.className}`}
    >
      <img
        className="h-6 w-6 animate-spin"
        src="https://res.cloudinary.com/djcn6luvw/image/upload/v1693814593/Medibook/loading_zwsigy.png"
        alt="Loading button"
      />
    </button>
  );
};

interface Props {
  className?: string;
}
export default LoadingButton;
