import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SnackbarOrigin, useSnackbar, VariantType } from "notistack";

export interface AlertType {
  message: string;
  variant?: VariantType;
  anchorOrigin?: SnackbarOrigin;
}

export const useAlert = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const Alert = ({
    message,
    variant = "info",
    anchorOrigin = {
      vertical: "bottom",
      horizontal: "right",
    },
  }: AlertType) => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin,
      action: (key) => (
        <FontAwesomeIcon
          className="h-3 w-3 p-4"
          icon={faXmark}
          onClick={() => {
            closeSnackbar(key);
          }}
        />
      ),
    });
  };

  return { Alert };
};
