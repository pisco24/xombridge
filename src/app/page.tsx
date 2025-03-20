"use client";
export const dynamic = "force-dynamic";
import { Box, Container } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import Bridge from "@/components/Bridge";

export default function Home() {
  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "auto",
        "& .MuiContainer-root": {
          "@media (min-width:1260px)": {
            maxWidth: "1400px",
          },
        },
      }}
    >
      <Header />
      <Container>
        <Bridge />
      </Container>
      <ToastContainer autoClose={3000} draggableDirection="x" />
    </Box>
  );
}
