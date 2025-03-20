"use client";
import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect} from "react";
import logo_mobile from "../assets/new_logo.png";
import banner from "../assets/banner.png";
import { ThemeContext } from "@/context/ThemeContext";

// import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTranslation } from "react-i18next";

import dynamic from "next/dynamic";
import { AppContext } from "@/context/AppContext";
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const Header = () => {
  const { i18n } = useTranslation();
  const { currentLang, setCurrentLang } = useContext(ThemeContext);
  const { selectedFrom } = useContext(AppContext);

  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang, i18n]);
  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang) {
      setCurrentLang(storedLang);
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          // position: "fixed",
          zIndex: "3",
          top: "0",
          left: "0",
          py: "16px",
          px: "16px",
          width: "100%",
        }}
      >
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: "1rem",
              justifyContent: { sm: "space-between", xs: "space-between" },
              "& button": {
                textTransform: "capitalize",
                fontSize: "15px !important",
                height: "40px !important",
                fontWeight: "bold",
                color: `var(--connect_color) !important`,
                transition: "0.5s all",
                background: "var(--connect_bg) !important",
                boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.5) !important",
                borderRadius: "12px !important",
                "&:hover": {
                  transform: "none !important",
                },
              },
              "& .ju367vcl": {
                border: "0 !important",
                color: "var(--connect_color) !important",
              },
              "& .ju367va3": {
                background: "var(--connect_bg) !important",
              },
            }}
          >
            {/* Left Section */}
            <Box
              sx={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                height: "3rem",
              }}
            >
              <a href="https://xombol.app/" target="_blank">
                <Typography
                  component={"img"}
                  src={logo_mobile.src}
                  className="xombol-logo"
                  sx={{
                    cursor: "pointer",
                  }}
                />
              </a>
              <Typography
                component={"img"}
                src={banner.src}
                className="xombol-banner"
                sx={{
                  cursor: "pointer",
                }}
              />
              {/* <Typography
                sx={{
                  fontSize: "30px",
                  fontFamily: "Inter, monospace",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  display: { md: "block", xs: "none" },
                }}
              >
                Xombol
                <img src={banner} height={}
              </Typography> */}
            </Box>

            {/* Right Section */}
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {selectedFrom.symbol == "SOL" ? (
                <Box className="btn_wrap_connect">
                  <WalletMultiButton
                    // variant='text'
                    style={{
                      // border: "2px solid",
                      // fontWeight: 900,
                      background: "transparent",
                      // borderRadius: "10px",
                      color: "white",
                    }}
                  />
                </Box>
              ) : (
                <Box className="btn_wrap_connect">
                  <ConnectButton chainStatus={"none"} label={"Select Wallet"} />
                </Box>
              )}
            </Box>
          </Box>
        </>
      </Box>
    </>
  );
};

export default Header;
