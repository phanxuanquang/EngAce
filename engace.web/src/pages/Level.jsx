import {
  Box,
  Container,
  CssBaseline,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import Logo from "../assets/user.png";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AppService } from "../services/api";
import { useNavigate } from "react-router-dom";
export default function Level() {
  const token = Cookies.get("token");
  const initName = localStorage.getItem("name");
  const initLevel = localStorage.getItem("level");

  const [data, setData] = useState({});

  const [level, setLevel] = useState(initLevel ?? "1");
  const [englishLevels, setEnglishLevels] = useState({});
  const [name, setName] = useState(initName ?? "");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (token.startsWith("ya29.")) {
          const response = await AppService.getUserInfo();
          if (response.status === 200) {
            console.log(response.data);
            setData(response.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchEnglishLevels = async () => {
      try {
        const response = await AppService.getEnglishLevel();
        if (response.status === 200) {
          console.log(response.data);
          setEnglishLevels(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEnglishLevels();
    fetchUserInfo();
  }, [token]);

  const handleChange = (event) => {
    setLevel(event.target.value);
  };

  const handleSubmit = () => {
    if (token.startsWith("ya29.")) {
      localStorage.setItem("name", data?.name);
      localStorage.setItem("picture", data?.picture);
      localStorage.setItem("level", level);
    } else {
      localStorage.setItem("name", name);
      localStorage.setItem("level", level);
    }
    navigate("/");
  };

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
            sx={{ width: "80%" }}
          >
            <img src={Logo} alt="Mô tả về ảnh" width="500" height="300"/>
            {token.startsWith("ya29.") ? (
              <Typography variant="h3" sx={{ fontWeight: "normal"}}>
                Xin chào, {data?.name}
              </Typography>
            ) : (
              <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                <Typography variant="body1" sx={{ marginBottom: "0.5rem"}}>Nhập tên của bạn</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  required
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-input": {
                      bgcolor: "#fafafa",
                      borderRadius: 1,
                    },
                  }}
                  placeholder="Nguyễn Văn A"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </FormControl>
            )}

            {Object.keys(englishLevels).length > 0 && (
              <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                <Typography variant="body1" sx={{ marginBottom: "0.5rem"}}>
                  Trình độ tiếng Anh của bạn
                </Typography>
                <Select
                  labelId="gender-label"
                  id="gender"
                  value={level}
                  onChange={handleChange}
                  sx={{
                    bgcolor: "#fafafa",
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        width: "60%",
                      },
                    },
                  }}
                >
                  {Object.keys(englishLevels).map((key) => (
                    <MenuItem
                      key={key}
                      value={key}
                      sx={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                      }}
                    >
                      {englishLevels[key]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Button
              variant="contained"
              size="large"
              sx={{
                color: "white",
                fontSize: "1.2rem",
                "&:not(:disabled)": {
                  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                    opacity: 0.8,
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  },
                },
              }}
              onClick={() => handleSubmit()}
            >
              Xác nhận
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
