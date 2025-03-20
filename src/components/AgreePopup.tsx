"use client";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import ErrorIcon from "@mui/icons-material/Error";
import { ModalProps } from "@/types";
import { t } from "i18next";

export default function AgreePopup({ isDialogOpen, setIsDialogOpen }: ModalProps) {
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
          marginTop: { lg: "-10rem" },
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
        },
        "& p,div,a,button": {
        },
      }}
    >
      <DialogContent dividers>
        <Typography
          textAlign={"center"}
          sx={{
            fontSize: "30px",
            fontWeight: "bold",
            mb: "2rem",
          }}
        >
          {t("Welcome to")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "5px",
            py: "0.7rem",
          }}
        >
          <HelpIcon />
          <Typography
            sx={{
              fontSize: "16px",
            }}
          >
           {t("For bridging help please head over to support & FAQs.")}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "5px",
          }}
        >
          <ErrorIcon />
          <Typography
            sx={{
              fontSize: "16px",
            }}
          >
           {t("By using this interface you agree to our Terms and Privacy Policy.")}
          </Typography>
        </Box>

        <Box mt={"1.5rem"}>
          <Button className="common_btn" onClick={() => setIsDialogOpen(false)}>
           {t("Agree & continue")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
