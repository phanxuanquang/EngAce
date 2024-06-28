import { Box, Container, CssBaseline } from "@mui/material";
import GoogleLoginButton from "../common/GoogleLoginButton";
import GuessLoginButton from "../common/GuessLoginButton";
import MyCustomTitle from "../common/MyCustomTitle";

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
            gap={4}
          >
            <MyCustomTitle sx={{ fontSize: "100px !important" }}>
              EngAce
            </MyCustomTitle>
            <GoogleLoginButton />
            <GuessLoginButton />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
