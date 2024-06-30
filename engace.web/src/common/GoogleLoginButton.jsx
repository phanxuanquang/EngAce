import { useState } from "react";
import { Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AppService } from "../services/api";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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

  const handleLogin = () => {
    handleCloseDialog(); 
    login(); 
  };

  return (
    <>
      <Tooltip title="Chỉ dành cho sinh viên UIT" placement="top">
        <Button
          variant="contained"
          onClick={handleOpenDialog} 
          sx={{
            textTransform: "none",
            fontSize: "1.2rem",
            width: "90%",
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              opacity: 0.9,
              transform: "scale(1.05)",
              boxShadow: "0 0.2rem 1.2rem #ffffff",
              border: "0px"
            },
          }}
          size="large"
        >
          Đăng nhập bằng Google
        </Button>
      </Tooltip>
      <Dialog open={openDialog} onClose={handleCloseDialog} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <DialogTitle variant="h4" component="h2">Xác nhận đăng nhập</DialogTitle>
        <DialogContent>
          <a>Tính năng này chỉ dùng cho Gmail của sinh viên UIT.</a>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleLogin} variant="contained" autoFocus>
            Tiếp tục
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
