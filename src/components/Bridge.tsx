"use client";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useContext, useEffect } from "react";

// import { useConnectModal } from "@rainbow-me/rainbowkit";
import available from "../assets/available.svg";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { networkItems, tokenItems } from "@/config";
import { useAccount, useSwitchChain, WagmiContext } from "wagmi";
import { executeBrige, getWalletBalance } from "@/services/abi";
import { NetworkInfo, TokenBalance } from "@/types";
import { getLogoWidth } from "@/utils/functions";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ThemeContext } from "@/context/ThemeContext";
import { AppContext } from "@/context/AppContext";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import { executeBridgeSolana, getWalletBalanceSol } from "@/services/idl/index";

const Bridge = () => {
  const { t, i18n } = useTranslation();
  const { currentLang, setCurrentLang } = useContext(ThemeContext);
  const changeLanguage = (languageCode: string) => {
    localStorage.setItem("lang", languageCode);
    setCurrentLang(languageCode);
    i18n.changeLanguage(languageCode);
  };
  const { selectedFrom, setSelectedFrom } = useContext(AppContext);
  const account = useAccount();
  const config = useContext(WagmiContext);
  const [amount, setAmount] = useState("");
  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };
  // const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();

  // const [selectedFrom, setSelectedFrom] =
  //   useState<NetworkInfo>(defaultSourceChain); // Default to
  const [selectedTo, setSelectedTo] = useState<NetworkInfo>(networkItems[1]); // Default to Ethereum
  const [walletBalance, setWalletBalance] = useState([] as TokenBalance[]);
  // const [selectedCoin, setSelectedCoin] = useState("XOM");
  // const selectedCoin = "XOM";

  const [targetAddress, setTargetAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(true);

  const handleTargetAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetAddress(event.target.value);
  };

  const solAccount = useWallet();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const { connection: solConnection } = useConnection();

  const handleFromChange = (event: SelectChangeEvent<string>) => {
    const network = networkItems.find(
      (item) => item.chainId.toString() === event.target.value
    );
    setSelectedFrom(network!);
    switchChain({ chainId: Number(event.target.value) });
    if (selectedTo.chainId.toString() == event.target.value) {
      const target = networkItems.find(
        (item) => item.chainId.toString() != event.target.value
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      setSelectedTo(target!);
    }
  };

  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDefault(event.target.checked);
  };

  const handleToChange = (event: SelectChangeEvent<string>) => {
    const network = networkItems.find(
      (item) => item.chainId.toString() === event.target.value
    );
    setSelectedTo(network!);
    if (selectedFrom.chainId.toString() == event.target.value) {
      const target = networkItems.find(
        (item) => item.chainId.toString() != event.target.value
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      setSelectedFrom(target!);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      switchChain({ chainId: target!.chainId });
    }
  };

  // const handleCoin = (event: SelectChangeEvent<string>) => {
  //   const selectedCoin = event.target.value;
  //   setSelectedCoin(selectedCoin);
  // };

  const handleChange = () => {
    const source = selectedFrom;
    setSelectedFrom(selectedTo);
    setSelectedTo(source);
  };

  useEffect(() => {
    async function fetchBalance(address: string) {
      const walletTokenBalance = await getWalletBalance(
        selectedFrom,
        address,
        config
      );
      setWalletBalance(walletTokenBalance);
    }

    async function fetchBalanceSol(address: PublicKey) {
      const walletTokenBalance = await getWalletBalanceSol(
        selectedFrom,
        address,
        solConnection
      );
      setWalletBalance(walletTokenBalance);
    }
    if (selectedFrom.symbol == "SOL") {
      if (solAccount && solAccount.publicKey) {
        fetchBalanceSol(solAccount.publicKey);
      }
    } else {
      if (account && account.address) {
        fetchBalance(account.address);
      }
    }
    setTargetAddress("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, solAccount, selectedFrom]);

  const getTitle = () => {
    // if (!account || !account.address) {
    //   return t("CONNECT WALLET");
    // }

    // if (Number(amount) == 0) {
    //   return t("Input token amount");
    // }

    // if (
    //   getTokenBalance1(selectedCoin) >= Number(amount) &&
    //   account != undefined &&
    //   account.address != undefined
    // )
    return t("Review Bridge");
    // else return t("Insufficient Balance");
  };

  const handleSubmitEVM = async () => {
    if (!account || !account.address) {
      toast.error("Please connect wallet.");
      return;
    }

    if (Number(walletBalance[0].balance) < Number(amount)) {
      toast.error("Insufficient balance");
      return;
    }

    if(selectedTo.symbol == "SOL" && targetAddress == ""){
      toast.error("Please set destination address.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await executeBrige(
        selectedFrom,
        selectedTo,
        targetAddress ? targetAddress : account.address!,
        account.address!,
        Number(amount),
        config
      );

      if (result) {
        toast.success("Sent token successfully.");
        const walletTokenBalance = await getWalletBalance(
          selectedFrom,
          account.address,
          config
        );
        setWalletBalance(walletTokenBalance);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error("Sent token failed: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSolana = async () => {
    if (solAccount == undefined || solAccount.publicKey == undefined) {
      toast.error("Please connect wallet.");
      return;
    }

    if (targetAddress == "") {
      toast.error("Please set destination address.");
      return;
    }
    if (Number(walletBalance[0].balance) < Number(amount)) {
      toast.error("Insufficient balance");
      return;
    }
    setIsLoading(true);
    try {
      const result = await executeBridgeSolana(
        solAccount,
        solConnection,
        targetAddress,
        selectedFrom,
        selectedTo,
        Number(amount) * LAMPORTS_PER_SOL
      );

      if (result) {
        toast.success("Sent token successfully.");
        const walletTokenBalance = await getWalletBalanceSol(
          selectedFrom,
          solAccount.publicKey,
          solConnection
        );
        setWalletBalance(walletTokenBalance);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error("Sent token failed: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: { sm: "440px", xs: "100%" },
        m: { sm: "5rem auto", xs: "1rem auto 2rem" },
        "& p": {
          // fontFamily: Inter_font.style.fontFamily,
        },
      }}
    >
      <Box
        sx={{
          mb: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "5px",
          width: "100%",
        }}
      >
        <Button
          className="btn"
          sx={{
            px: "15px",
            height: "30px !important",
          }}
        >
          {t("Bridge")}
        </Button>
      </Box>
      <Box
        sx={{
          background: `var(--common)`,
          borderRadius: "20px",
          p: "1rem",
          "& .box": {
            background: `var(--box_bg)`,
            borderRadius: "20px",
            p: "1rem",
            mb: "0.5rem",
          },
          "& .bin1": {
            "& input,textarea": {
              // fontFamily: Inter_font.style.fontFamily,
            },
          },
        }}
      >
        <Grid container spacing={5} position={"relative"}>
          <Grid item md={6} xs={6} zIndex={2}>
            <Box
              sx={{
                width: "23px",
                height: "25px",
                borderRadius: "5px",
                background: `var(--box_bg)`,
                border: "1px solid var(--light_dark)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(35%, 10%)",
              }}
              onClick={() => handleChange()}
            >
              <ArrowForwardIosIcon
                sx={{
                  fontSize: "1rem",
                  color: "var(--light_dark)",
                  cursor: "pointer",
                }}
              />
            </Box>
            <Box display={"flex"} flexDirection={"column"} minWidth={"100%"}>
              <Select
                fullWidth
                value={selectedFrom.chainId.toString()}
                onChange={handleFromChange}
                displayEmpty
                renderValue={() => {
                  return (
                    <Box className="box" minWidth={"100%"} maxWidth={"100%"}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                        }}
                      >
                        <Typography
                          component={"img"}
                          src={selectedFrom.icon}
                          width={getLogoWidth(selectedFrom.chainId)}
                          height={28}
                        />
                        <Box>
                          <Typography className="light_dark_text">
                            {t("From")}
                          </Typography>
                          <Typography className="text_">
                            {selectedFrom?.label ?? t("Select Network")}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                }}
                sx={{
                  minWidth: "unset",
                  width: "auto",
                  padding: 0,
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    padding: "0 !important",
                    minHeight: "unset",
                  },
                  "& fieldset": { border: "none" },
                  "& svg": { display: "none" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: `var(--common) !important`,
                      color: "var(--foreground) !important",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Optional: Adds shadow
                    },
                  },
                }}
              >
                {networkItems.map((item) => (
                  <MenuItem
                    key={item.chainId.toString()}
                    value={item.chainId.toString()}
                  >
                    <Typography
                      component={"img"}
                      src={item.icon}
                      width={item.width ? item.width : 28}
                      height={item.height ? item.height : 28}
                      mr={"0.3rem"}
                    />
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>
          <Grid item md={6} xs={6}>
            <Box display={"flex"} flexDirection={"column"} width={"100%"}>
              <Select
                fullWidth
                value={selectedTo.chainId.toString()}
                onChange={handleToChange}
                displayEmpty
                renderValue={() => {
                  return (
                    <Box className="box" minWidth={"100%"} maxWidth={"100%"}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                        }}
                      >
                        <Typography
                          component={"img"}
                          src={selectedTo.icon}
                          width={getLogoWidth(selectedTo.chainId)}
                          height={28}
                        />
                        <Box>
                          <Typography className="light_dark_text">
                            {t("To")}
                          </Typography>
                          <Typography className="text_">
                            {selectedTo?.label ?? t("Select Network")}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                }}
                sx={{
                  minWidth: "unset",
                  width: "auto",
                  padding: 0,
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    padding: "0 !important",
                    minHeight: "unset",
                  },
                  "& fieldset": { border: "none" },
                  "& svg": { display: "none" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: `var(--common) !important`,
                      color: "var(--foreground) !important",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Optional: Adds shadow
                    },
                  },
                }}
              >
                {networkItems.map((item) => (
                  <MenuItem
                    key={item.chainId.toString()}
                    value={item.chainId.toString()}
                  >
                    <Typography
                      component={"img"}
                      src={item.icon}
                      width={item.width ? item.width : 28}
                      height={item.height ? item.height : 28}
                      mr={"0.3rem"}
                    />
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            background: `var(--box_bg)`,
            borderRadius: "20px",
            p: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <TextField
              className="bin1"
              fullWidth
              type="text"
              placeholder="0.0"
              variant="standard"
              value={amount}
              onChange={handleAmount}
              InputProps={{
                disableUnderline: true,
              }}
            />
            <Box flex={1}>
              {/* <Select
                value={selectedCoin}
                onChange={handleCoin}
                displayEmpty
                aria-label="Network Selector"
                sx={{
                  borderRadius: "23px",
                  fontWeight: "600",
                  background: "var(--light_dark)",
                  color: "var(--foreground)",
                  "& .MuiOutlinedInput-input": {
                    p: "7px 14px",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& fieldset": {
                    border: "none !important",
                    "&:hover": {
                      border: "none",
                    },
                  },
                  "& svg": {
                    color: "#fff",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: `var(--common) !important`,
                      color: "var(--foreground) !important",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Optional: Adds shadow
                    },
                  },
                }}
              > */}
              {tokenItems[Number(selectedFrom.chainId)].map((item) => (
                <MenuItem
                  key={item.symbol}
                  value={item.symbol}
                  sx={{
                    borderRadius: "23px",
                    fontWeight: "600",
                    background: "var(--light_dark)",
                    color: "var(--foreground)",
                    "& .MuiOutlinedInput-input": {
                      p: "7px 14px",
                      display: "flex",
                      alignItems: "center",
                    },
                    "&:hover": {
                      background: "var(--light_dark)",
                    },
                    "& fieldset": {
                      border: "none !important",
                      // "&:hover": {
                      //   border: "none",
                      // },
                    },
                    // "& svg": {
                    //   color: "#fff",
                    // },
                  }}
                >
                  <Typography
                    component={"img"}
                    src={item.icon}
                    width={32}
                    height={32}
                    mr={"0.3rem"}
                  />
                  {item.symbol}
                </MenuItem>
              ))}
              {/* </Select> */}
            </Box>
          </Box>
          <Box
            mt={"0.5rem"}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {((account && account.address) ||
              (solAccount && solAccount.publicKey)) && (
              <Typography className="light_dark_text">
                {walletBalance.length == 0 ? "0" : walletBalance[0].balance} XOM{" "}
                {t("available")}{" "}
                <Typography
                  component={"img"}
                  src={available.src}
                  sx={{ verticalAlign: "middle" }}
                />
              </Typography>
            )}
          </Box>
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={"1px"}>
          <Box>
            <Checkbox
              disabled={
                selectedFrom.symbol == "SOL" || selectedTo.symbol == "SOL"
              }
              checked={isDefault}
              onChange={handleCheckedChange}
            />
            Set Destination Address
          </Box>
          {(isDefault ||
            selectedFrom.symbol == "SOL" ||
            selectedTo.symbol == "SOL") && (
            <Box
              sx={{
                background: `var(--box_bg)`,
                borderRadius: "20px",
                px: "1rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <TextField
                  className="bin1"
                  fullWidth
                  type="text"
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "20px", // Adjust the value as needed
                    },
                  }}
                  placeholder="Destination address"
                  variant="standard"
                  value={targetAddress}
                  onChange={handleTargetAddress}
                  InputProps={{
                    disableUnderline: true,
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        <Button
          disabled={isLoading}
          className="common_btn"
          sx={{
            mt: "1.5rem",
          }}
          // disabled={}
          onClick={() => {
            // if (!account || !account.address) {
            //   openConnectModal!();
            // }

            // switchChain({ chainId: selectedFrom.chainId });
            // openChainModal!();

            // if (getTokenBalance1(selectedCoin) < Number(amount)) {
            //   toast.error("Insufficient balance.");
            //   return;
            // }

            if (selectedFrom.symbol == "SOL") {
              handleSubmitSolana();
            } else {
              handleSubmitEVM();
            }
          }}
        >
          {getTitle()}
          {isLoading && <CircularProgress size={24} />}
        </Button>
      </Box>
      {currentLang !== "en" && (
        <Typography
          py={"1rem"}
          sx={{
            fontSize: "12px",
            textAlign: "center",
            color: "var(--foreground)",
            opacity: "0.7",
            "&:hover": {
              opacity: "0.9",
            },
          }}
        >
          Xombol {t("Bridge")} {t("available in")}:{" "}
          <Link href={"/"}>
            <b
              style={{ textDecoration: "underline" }}
              onClick={() => changeLanguage("en")}
            >
              English
            </b>
          </Link>
        </Typography>
      )}
    </Box>
  );
};

export default Bridge;
