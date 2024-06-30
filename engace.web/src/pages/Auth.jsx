import { Box, Container, CssBaseline } from "@mui/material";
import GoogleLoginButton from "../common/GoogleLoginButton";
import GuessLoginButton from "../common/GuessLoginButton";
import Logo from "../assets/icon.png";
import BackgroundImage from "../assets/Background.jpg";

export default function Auth() {
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
      <Container fixed>
        <Box
          sx={{
            height: "100vh",
          }}
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
            <img src={Logo} alt="Mô tả về ảnh" width="400px" height="auto" />
            <GoogleLoginButton />
            <GuessLoginButton />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
