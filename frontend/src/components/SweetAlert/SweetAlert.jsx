import Swal from "sweetalert2";

const SweetAlert = {
  loading: (text = "Loading...") => {
    return Swal.showLoading();
  },

  notloading: (text = "Loading...") => {
    return Swal.close();
  },
  success: (title, text) => {
    return Swal.fire({
      icon: "success",
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 1500,
    });
  },
  error: (title, text) => {
    return Swal.fire({
      icon: "error",
      title: title,
      text: text,
    });
  },

  info: (title, text, onClickFunction) => {
    return Swal.fire({
      icon: "info",
      title: title,
      text: text,
      confirmButtonText: "Pay Now",
      preConfirm: () => {
        onClickFunction();
      },
    });
  },

  warning: (title, text) => {
    return Swal.fire({
      icon: "warning",
      title: title,
      text: text,
    });
  },
};

export default SweetAlert;
