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
