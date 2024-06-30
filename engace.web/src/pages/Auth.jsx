import { Box, Container, CssBaseline } from "@mui/material";
import GoogleLoginButton from "../common/GoogleLoginButton";
import GuessLoginButton from "../common/GuessLoginButton";
import Logo from "../assets/icon.png";

export default function Auth() {
  return (
    <Box sx={{ bgcolor: "#cfe8fc" }}>
      <CssBaseline />
      <Container fixed>
        <Box
          sx={{ bgcolor: "#cfe8fc", height: "100vh" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap={3}
          >
            <img src={Logo} alt="Mô tả về ảnh" width="500" height="300"/>
            <GoogleLoginButton />
            <GuessLoginButton />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
