import { Snackbar, Alert } from "@mui/material";

interface SnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
  severity?: "success" | "error" | "info" | "warning";
}

export function SnackbarComponent({
  open,
  message,
  onClose,
  autoHideDuration = 2000,
  severity = "success",
}: SnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}