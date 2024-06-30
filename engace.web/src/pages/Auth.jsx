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
          sx={{ bgcolor: "#cfe8fc", height: "100vh", }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          maxWidth="lg"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap={2}
          >
            <img src={Logo} alt="Mô tả về ảnh" width="400px" height="auto"/>
            <GoogleLoginButton />
            <GuessLoginButton />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
