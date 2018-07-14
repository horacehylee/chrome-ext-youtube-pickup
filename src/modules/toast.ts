import * as nativeToast from "native-toast";

interface ToastOptions {
  message: string;
  type: "success" | "warning" | "info" | "error";
}

export const showToast = ({ message, type }: ToastOptions) => {
  nativeToast({
    message,
    position: "top",
    timeout: 3000,
    type
  });
};
