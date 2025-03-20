"use client";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import metamask from "../assets/MetaMASK.svg";
import coin_wallet from "../assets/coin_wallet.svg";
import wallet_connect from "../assets/wallet_connect.svg";
import { ConnectModalProps } from "@/types";
import { t } from "i18next";

interface BootstrapDialogTitleProps {
  children: React.ReactNode;
  onClose?: () => void;
}

const data = [
  { value: "0", label: "MetaMask", icon: metamask.src },
  { value: "1", label: "WalletConnect", icon: wallet_connect.src },
  { value: "2", label: "Coinbase Wallet", icon: coin_wallet.src },
];

function BootstrapDialogTitle(props: BootstrapDialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        fontSize: "1.2rem",
        p: 2,
        // borderBottom: "2px solid rgba(255, 255, 255, 0.22)",
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
            color: "var(--foreground)",
            background: "var(--light_dark)",
            "&:hover": {
              background: "var(--light_dark)",
            }
          }}
        >
          <CloseIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      )}
    </DialogTitle>
  );
}

export default function ConnectModal({ isDialogOpen, setIsDialogOpen }: ConnectModalProps) {
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
          borderRadius: "20px",
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
        Connect a wallet
      </BootstrapDialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: { sm: "80%", xs: "95%" },
            m: "0 auto",
          }}
        >
          {data?.map((item, index) => (
            <Box
              key={index}
              sx={{
                background: `var(--box_bg)`,
                borderRadius: "13px",
                p: "1rem",
                m: "0 auto 0.6rem",
              }}
            >
              <Box className="flex">
                <Typography
                  className="foreground_text"
                  sx={{ fontSize: "16px !important" }}
                >
                  {item.label}
                </Typography>

                <Typography component={"img"} src={item.icon} />
              </Box>
            </Box>
          ))}
          <Typography
            my={"2rem"}
            className="foreground_text"
            sx={{
              fontSize: "12px !important",
              fontWeight: "400 !important",
              textAlign: "center",
            }}
          >
            By connecting a wallet, you agree to the Terms of Service and
            consent to its <b>Privacy Policy</b>.
          </Typography>
        </Box>
      </DialogContent>
      <Box
        sx={{
          mt: "1.5rem",
          background: "rgba(255, 255, 255, 0.3)",
          p: "1rem 1.5rem",
          borderRadius: "0 0 20px 20px",
        }}
      >
        <Box className="flex">
          <Typography
            className="foreground_text"
            sx={{ fontWeight: "400 !important" }}
          >
           {t("New to wallet")}
          </Typography>
          <Button
            className="btn"
            sx={{
              px: "15px",
              background: "var(--box_bg) !important",
              borderRadius: "5px !important",
            }}
          >
            Learn More
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
