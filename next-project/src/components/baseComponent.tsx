import { useState, ReactNode } from "react";
import { SnackbarComponent } from "./snackbar";

interface BaseComponentProps {
  children: (snackbarHelpers: {
    openSnackbar: boolean;
    setOpenSnackbar: (open: boolean) => void;
    handleOpenSnackbar: () => void;
    handleCloseSnackbar: () => void;
  }) => ReactNode;
  snackbarMessage?: string | null;
  snackbarSeverity?: "success" | "error" | "info" | "warning";
}

export function BaseComponent({
  children,
  snackbarMessage,
  snackbarSeverity = "success",
}: BaseComponentProps) {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpenSnackbar = () => setOpenSnackbar(true);
  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <>
      {children({
        openSnackbar,
        setOpenSnackbar,
        handleOpenSnackbar,
        handleCloseSnackbar,
      })}
      {snackbarMessage && (
        <SnackbarComponent
          open={openSnackbar}
          message={snackbarMessage}
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        />
      )}
    </>
  );
}