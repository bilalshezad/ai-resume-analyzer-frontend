import { toast } from 'react-toastify';

export const handleSuccess = (msg) => {
  toast.success(msg, {
    position: 'top-center',
    autoClose : 200
  });
};

export const handleError = (msg) => {
  toast.error(msg, {
    position: 'top-center',
        autoClose : 200
  });
};
export const handleLoading = (msg) => {
  return toast.loading(msg, {
    position: "top-center",
        autoClose : 200
  });
};

