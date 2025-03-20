"use client";
import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import logo_mobile from "../assets/new_logo.png";
import banner from "../assets/banner.png";
import { ThemeContext } from "@/context/ThemeContext";
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
    <Box sx={{ zIndex: 3, top: 0, left: 0, py: "16px", px: "16px", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: "1rem",
          justifyContent: "space-between",
        }}
      >
        {/* Left Section: Logo & Banner */}
        <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center", height: "3rem" }}>
          <a href="https://xombol.io" target="_blank" rel="noopener noreferrer">
            <Typography
              component="img"
              src={logo_mobile.src}
              className="xombol-logo"
              sx={{
                cursor: "pointer",
                width: "140px", // 40% bigger than before
                height: "auto",
              }}
            />
          </a>
          <Typography
            component="img"
            src={banner.src}
            className="xombol-banner"
            sx={{
              cursor: "pointer",
              width: "140px", // 40% bigger than before
              height: "auto",
            }}
          />
        </Box>

        {/* Center Section: Social Tab */}
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* X Icon */}
          <a
            href="https://x.com/khombole_gare"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on X"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </a>
          {/* Telegram Icon */}
          <a
            href="https://t.me/+E_IoMnClUlE5ZmEx"
            target="_blank"
            rel="noopener noreferrer"
            title="Join us on Telegram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              width="24"
              height="24"
              viewBox="0 0 240 240"
            >
              <path d="M120 0C53.73 0 0 53.73 0 120s53.73 120 120 120 120-53.73 120-120S186.27 0 120 0zm58.08 83.93L158.4 176.52c-1.49 6.61-5.38 8.25-10.88 5.15l-30.08-22.2-14.5 14c-1.6 1.6-2.93 2.93-6 2.93l2.14-30.33L94.91 114.3c-2.4-2.14.52-3.33 3.74-1.19l55.33 50.1 15.13-13.95c6.87-6.37 2.64-9.93-4.12-3.87l-53.87 43.92L85.12 126.9l93.96-73.97c4.34-3.4 8.27-1.62 6.08 2.9z" />
            </svg>
          </a>
        </Box>

        {/* Right Section: Wallet Button */}
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {selectedFrom.symbol === "SOL" ? (
            <Box className="btn_wrap_connect">
              <WalletMultiButton
                style={{
                  background: "transparent",
                  color: "white",
                }}
              />
            </Box>
          ) : (
            <Box className="btn_wrap_connect">
              <ConnectButton chainStatus="none" label="Select Wallet" />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
