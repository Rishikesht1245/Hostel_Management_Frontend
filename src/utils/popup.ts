import Swal from "sweetalert2";

//swal.mixin function is used for creating custom styled alerts
export const customPopup = Swal.mixin({
  //  ! is used to apply tailwind utility classes for styling
  customClass: {
    title: "!text-xl !mt-3 !text-primary",
    denyButton: "!text-sm",
    cancelButton: "!text-sm",
    closeButton: "!text-sm",
    confirmButton: "!text-sm",
  },
});
