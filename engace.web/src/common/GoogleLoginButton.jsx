import { Button } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AppService } from "../services/api";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await AppService.healCheck(tokenResponse.access_token);

        if (response.status === 200) {
          const remainingMilliseconds = tokenResponse.expires_in * 1000;
          const expiryDate = new Date(
            new Date().getTime() + remainingMilliseconds
          );
          Cookies.set("token", tokenResponse.access_token, {
            expires: expiryDate,
          });
          navigate("/level");
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Button
      variant="contained"
      onClick={login}
      sx={{
        textTransform: "none",
        fontSize: "1.2rem",
        width: "90%",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
      endIcon={<GoogleIcon />}
    >
      Đăng nhập bằng Google
    </Button>
  );
}
