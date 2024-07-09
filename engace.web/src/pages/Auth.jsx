import { Box, Container, CssBaseline } from "@mui/material";
import GoogleLoginButton from "../common/GoogleLoginButton";
import GuessLoginButton from "../common/GuessLoginButton";
import Logo from "../assets/icon.png";
import BackgroundImage from "../assets/Background.jpg";
import { useState } from "react";
import TruckLoader from "../common/TruckLoader";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  return (
    <Box
      sx={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <CssBaseline />
      <Container
        fixed
        sx={{
          height: "100%",
        }}
      >
        <Box
          sx={{
            height: "100%",
          }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={2}
          maxWidth="lg"
        >
          <img src={Logo} alt="logo" width={"80%"} style={{ maxWidth: 400, marginBottom: 3 }} />
          {!loading ? (
            <>
              <GuessLoginButton />
              <GoogleLoginButton setLoading={setLoading} />
            </>
          ) : (
            <TruckLoader />
          )}
        </Box>
      </Container>
    </Box>
  );
}
