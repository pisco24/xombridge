"use client";
import React, { useState } from "react";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import usdc from "../../assets/usdc.png";
import usdt from "../../assets/usdt.svg";
import watch from "../../assets/watch.svg";
import fuel from "../../assets/fuel.svg";
// import via from "../../assets/via.svg";
import HelpIcon from "@mui/icons-material/Help";
import add_from from "../../assets/from.svg";
import add_to from "../../assets/to.svg";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { BridgeStepProps } from "@/types";
import { networkItems, tokenItems } from "@/config";
import { truncateAddress } from "@/utils/functions";
import { useAccount } from "wagmi";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={"0.5rem 0"}>{children}</Box>}
    </div>
  );
};

const SuccessfullBridge = (stepProps: BridgeStepProps) => {
  const account = useAccount();
  const {t}=useTranslation()
  const [tabIndex, setTabIndex] = useState<number>(0);
  
  if (!account) {
    return <></>;
  }

  const handleChange = (_event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };
  return (
    <Box
      textAlign={"center"}
      mt={"1rem"}
      sx={{
        "& .box": {
          background: `var(--box_bg)`,
          borderRadius: "10px",
          p: "0.5rem 1rem",
          textAlign: "start",
        },
      }}
    >
      <Typography
        component={"img"}
        src={stepProps.symbol == "USDT" ? usdt.src : usdc.src}
        sx={{ width: "67px", height: "67px" }}
      />
      <Typography
        sx={{
          pt: "0.5rem",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        {t("Bridge")} {stepProps.amount} {stepProps.symbol}
      </Typography>
      {/* <Typography
        sx={{
          pb: "0.5rem",
          fontSize: "13px",
          opacity: "0.7",
        }}
      >
        {t("Via Native Bridge")}
      </Typography> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "1rem",
          "& .MuiButtonBase-root": {
            color: "var(--foreground) !important",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            border: "none",
            gap: "5px",
            // fontFamily: `${Press_Start_2P_font.style.fontFamily}`,
            p: "10px 15px",
            fontSize: "13px !important",
            fontWeight: "600 !important",
            textTransform: "capitalize",
            minHeight: "auto",
          },
          "& .MuiTabs-indicator": {
            display: "none"
          },
          "& .MuiTabs-flexContainer": {
            overflow: "auto",
            justifyContent: "center",
            background: "#8A898E",
            borderRadius: "20px",


          },
          "& .MuiTab-root.Mui-selected": {
            background: "var(--light_dark)",
            borderRadius: "20px",
            border: "none"
          },
          "& .MuiTouchRipple-root": {
            display: "none",
          },
        }}
      >
        <Tabs value={tabIndex} onChange={handleChange} sx={{ lineHeight: "0" }}>
          <Tab label={t("Steps")} />
          <Tab label={t("Bridge Info")} />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        {/* steps  */}
        <Box>
          <Box
            className="box"
            sx={{
              mt: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <Typography component={"img"} src={networkItems.find((item) => item.chainId == stepProps.from)?.icon} width={26} height={26} />
              <Box>
                <Typography className="text_">{t("Start on")} {networkItems.find((item) => item.chainId == stepProps.from)?.label}</Typography>
                <Typography
                  className="light_dark_text"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px !important",
                  }}
                >
                  <Typography component={"img"} src={fuel.src} /> {stepProps.estimatedGas} {networkItems.find((item) => item.chainId == stepProps.from)?.symbol}
                </Typography>
              </Box>
            </Box>
            <CheckBoxIcon sx={{ fontSize: "1.8rem" }} />
          </Box>
          <Box
            className="box flex"
            sx={{
              my: "0.5rem",
              py: "1rem !important",
            }}
          >
            <Typography
              className="text_"
              sx={{
                fontSize: "13px !important",
              }}
            >
              <Typography
                component={"img"}
                width={26}
                src={watch.src}
                sx={{ verticalAlign: "middle" }}
              />{" "}
              {t("Wait")} {stepProps.estimatedTime}
            </Typography>
            <CheckBoxIcon sx={{ fontSize: "1.8rem" }} />
          </Box>
          <Box
            className="box flex"
            sx={{
              py: "1rem !important",
            }}
          >
            <Typography
              className="text_"
              sx={{
                fontSize: "13px !important",
              }}
            >
              <Typography
                component={"img"}
                src={networkItems.find((item) => item.chainId == stepProps.to)?.icon}
                width={26}
                height={26}
                sx={{ verticalAlign: "middle" }}
              />{" "}
              {t("Get")} {stepProps.amount} {stepProps.symbol} on {networkItems.find((item) => item.chainId == stepProps.to)?.label}
            </Typography>
            <CheckBoxIcon sx={{ fontSize: "1.8rem" }} />
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        {/* bridge info  */}
        <Box
          sx={{
            mt: "0.5rem",
            borderRadius: "20px",
            border: "1px solid var(--light_dark)",
            p: "1rem",
            "& img": {
              verticalAlign: "middle",
            },
          }}
        >
          <Box className="flex" mb={"1rem"}>
            <Typography className="text_">
              <Typography
                component={"img"}
                src={networkItems.find((item) => item.chainId == stepProps.from)?.icon}
                width={28}
                height={28}
              />{" "}
              {t("From")} {networkItems.find((item) => item.chainId == stepProps.from)?.label}
            </Typography>
            <Typography className="text_">
              {stepProps.amount} {stepProps.symbol}{" "}
              <Typography
                component={"img"}
                src={tokenItems[stepProps.from].find((item)=>item.symbol==stepProps.symbol)?.icon}
                width={28}
                height={28}
                sx={{ verticalAlign: "middle" }}
              />
            </Typography>
          </Box>
          <Box className="flex" mb={"1rem"}>
            <Typography className="text_">
              <Typography
                component={"img"}
                src={networkItems.find((item) => item.chainId == stepProps.to)?.icon}
                width={28}
                height={28}
              />{" "}
              {t("To")} {networkItems.find((item) => item.chainId == stepProps.to)?.label}
            </Typography>
            <Typography className="text_">
              {stepProps.amount} {stepProps.symbol}{" "}
              <Typography
                component={"img"}
                src={tokenItems[stepProps.to].find((item)=>item.symbol==stepProps.symbol)?.icon}
                width={28}
                height={28}
                sx={{ verticalAlign: "middle" }}
              />
            </Typography>
          </Box>
          <Box className="flex" mb={"1rem"}>
            <Typography className="text_">
              <Typography component={"img"} sx={{ width: "24px" }} src={add_from.src} /> {t("From")} {t("Address")}
            </Typography>
            <a href={networkItems.find((item) => item.chainId === stepProps.from)?.scanUrl + "/address/" + account.address} target="_blank" >
              <Typography className="text_">{truncateAddress(account.address)}</Typography>
            </a>
          </Box>
          <Box className="flex" mb={"1rem"}>
            <Typography className="text_">
              <Typography component={"img"} sx={{ width: "24px" }} src={add_to.src} /> {t("To")} {t("Address")}
            </Typography>
            <a href={networkItems.find((item) => item.chainId === stepProps.to)?.scanUrl + "/address/" + account.address} target="_blank" >
              <Typography className="text_">{truncateAddress(account.address)}</Typography>
            </a>
          </Box>
          <Box className="flex">
            <Typography className="text_">
              <Typography component={"img"} sx={{ width: "24px" }} src={watch.src} /> {t("Transfer Time")}
            </Typography>
            <Typography className="text_">~{stepProps.estimatedTime}</Typography>
          </Box>
        </Box>
      </TabPanel>
      <a href="https://docs.xombol.app/xombolbridge/xombol-bridge/help" target="_blank">
        <Button
          className="btn"
          sx={{
            mt: "2rem",
            px: "20px",
            fontSize: "12px !important",
            background: "var(--light_dark_bg) !important",
          }}
        >
        {t("Need help? View FAQs")} <HelpIcon sx={{ fontSize: "1rem", ml: "5px" }} />
        </Button>
      </a>
    </Box>
  );
};

export default SuccessfullBridge;
