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
    <Box sx={{ zIndex: "3", top: "0", left: "0", py: "16px", px: "16px", width: "100%" }}>
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
        <Box
          sx={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            height: "3rem",
          }}
        >
          <a href="https://xombol.io" target="_blank" rel="noopener noreferrer">
            <Typography
              component={"img"}
              src={logo_mobile.src}
              className="xombol-logo"
              sx={{
                cursor: "pointer",
                width: "140px", // 40% bigger than assumed 100px
                height: "auto",
              }}
            />
          </a>
          <Typography
            component={"img"}
            src={banner.src}
            className="xombol-banner"
            sx={{
              cursor: "pointer",
              width: "140px", // 40% bigger than assumed 100px
              height: "auto",
            }}
          />
        </Box>

        {/* Center Section: Social Bar */}
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
              <path d="M19.633 7.997c.013.177.013.353.013.53 0 5.392-4.1 11.61-11.61 11.61-2.3 0-4.436-.67-6.234-1.82.321.038.643.05.967.05 1.895 0 3.64-.643 5.033-1.722a4.063 4.063 0 0 1-3.793-2.82c.25.038.5.063.75.063.375 0 .75-.05 1.1-.138a4.062 4.062 0 0 1-3.253-3.98v-.05c.55.3 1.188.477 1.87.5a4.062 4.062 0 0 1-1.812-3.385c0-.75.2-1.45.55-2.05a11.535 11.535 0 0 0 8.375 4.25 4.57 4.57 0 0 1-.1-.93 4.062 4.062 0 0 1 4.062-4.062c1.17 0 2.225.5 2.97 1.3a8.007 8.007 0 0 0 2.57-.98 4.062 4.062 0 0 1-1.78 2.23 8.15 8.15 0 0 0 2.35-.64 8.74 8.74 0 0 1-2.03 2.1z" />
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
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM17.5938 8.20312L15.5859 16.1719C15.4336 16.8516 15.1172 16.999 14.5664 16.7812L11.2266 14.2109L9.5625 15.8047C9.38281 15.9844 9.19531 16.1719 8.97656 16.1719L8.95312 13.7812L15.3281 8.94531C15.6641 8.69531 15.3125 8.61719 15.0625 8.86719L8.19531 14.1016L5.42188 13.5C4.75781 13.3359 4.74219 12.7656 5.35938 12.5703L16.0234 9.17969C16.5234 9.03125 17.0156 9.35938 16.9531 9.84375C16.8828 10.2578 16.5742 10.4922 16.2109 10.4375L9.50781 9.61719L8.89844 7.10156L16.1094 7.82812C16.8125 7.92969 17.5234 8.11719 17.5938 8.20312Z" />
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
              <ConnectButton chainStatus={"none"} label={"Select Wallet"} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
