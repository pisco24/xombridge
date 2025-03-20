"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SuccessfullBridge from "./SuccessfullBridge";
import { ModalProps } from "@/types";

interface BootstrapDialogTitleProps {
  children: React.ReactNode;
  onClose?: () => void;
}


function BootstrapDialogTitle(props: BootstrapDialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        fontSize: "1.2rem",
        p: 1.2,
        fontWeight: "600",
      }}
      {...other}
    >
      {children}
      {onClose && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 6,
            top: 6,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
}

export default function SuccessBridgeModal({
  isDialogOpen,
  setIsDialogOpen,
  stepProps
}: ModalProps) {
  return (
    <Dialog
      onClose={() => setIsDialogOpen(false)}
      disableScrollLock
      aria-labelledby="customized-dialog-title"
      open={isDialogOpen}
      sx={{
        "& .MuiDialogContent-root": {
          padding: "1.5rem 1rem",
        },
        "& .MuiDialogActions-root": {
          padding: "1rem",
        },
        "& .MuiDialog-container": {
          backdropFilter: "blur(12px)",
          //   marginTop: "-10rem",
        },
        "& .MuiPaper-root": {
          maxWidth: "440px",
          borderRadius: "10px",
          m: "10px",
          background: `var(--common)`,
          backdropFilter: "blur(12.5px)",
          color: `var(--foreground)`,
          width: { md: "100% !important", xs: "440px !important" },
          overflowX: { md: "auto", xs: "scroll" },
          //   boxShadow: "inset 0px 0px 15px rgba(255, 255, 255, 0.4)",
        },
        "& p,div,a,button": {
          // fontFamily: Inter_font.style.fontFamily,
          // fontSize:"15px"
        },
      }}
    >
      <BootstrapDialogTitle onClose={() => setIsDialogOpen(false)}>
        <Typography />
      </BootstrapDialogTitle>
      <DialogContent>
        <SuccessfullBridge
          {...stepProps} />
      </DialogContent>
    </Dialog>
  );
}
