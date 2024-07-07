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
import DoneIcon from "@mui/icons-material/Check";
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
  border: "0px solid",
  borderRadius: 2,
  boxShadow: "0 0.2rem 1.2rem #ffffff",
  p: 4,
};

export default function GuessLoginButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyValue, setKeyValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrorMessage("");
  };
  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await AppService.healCheck(keyValue.trim());
      if (response.status === 200) {
        Cookies.set("token", keyValue.trim());
        handleClose();
        navigate("/level");
      }
    } catch (error) {
      setErrorMessage("Không hợp lệ");
      setKeyValue("");
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
          maxWidth: "40rem",
          bgcolor: "white",
          border: "0px",
          transition:
            "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out",
          "&:hover": {
            bgcolor: "white",
            transform: "scale(1.05)",
            border: "0px",
            boxShadow: "0 0.2rem 1.2rem #ffffff",
          },
        }}
        size="large"
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
              Nhập Gemini API Key để tiếp tục
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
              variant="standard"
              placeholder="AIza . . ."
              sx={{
                flexGrow: 1,
                height: "2.5rem",
                "& .MuiInputBase-root": {
                  height: "100%",
                },
              }}
              onChange={(e) => setKeyValue(e.target.value)}
              value={keyValue}
              error={!!errorMessage}
              helperText={errorMessage}
            />
            <Button
              component={Link}
              variant="outlined"
              color="secondary"
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              sx={{
                height: "2.5rem",
              }}
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
              endIcon={<DoneIcon />}
              variant="contained"
              onClick={handleSubmit}
              disabled={!keyValue.trim()}
              sx={{
                color: "white",
                "&:not(:disabled)": {
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                    opacity: 0.8,
                    transform: "scale(1.05)",
                    boxShadow: "0 0.2rem 1.2rem rgba(255, 255, 255, 0.2)",
                  },
                },
              }}
            >
              Xác nhận
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
