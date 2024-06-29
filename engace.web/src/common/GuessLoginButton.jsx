import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Link,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AppService } from "../services/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function GuessLoginButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyValue, setKeyValue] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await AppService.healCheck(keyValue.trim());
      if (response.status === 200) {
        Cookies.set("token", keyValue.trim());
        handleClose();
        navigate("/level");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        sx={{
          textTransform: "none",
          fontSize: "1.2rem",
          width: "100%",
          bgcolor: "white",
          "&:hover": {
            bgcolor: "#fafafa",
          },
        }}
        onClick={handleOpen}
      >
        Tiếp tục với tư cách khách
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <InputLabel htmlFor="outlined-basic">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Nhập GeminiAPI Key
            </Typography>
          </InputLabel>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 2,
              marginTop: 2,
              gap: 1,
            }}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              sx={{ flexGrow: 1 }}
              onChange={(e) => setKeyValue(e.target.value)}
              value={keyValue}
            />
            <Button
              component={Link}
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
            >
              Lấy Key
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoadingButton
              loading={loading}
              loadingPosition="end"
              endIcon={<SendIcon />}
              variant="contained"
              onClick={handleSubmit}
              disabled={!keyValue.trim()}
            >
              Xác nhận
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
