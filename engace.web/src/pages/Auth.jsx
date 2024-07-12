import {
  Box,
  Container,
  CssBaseline,
  Modal,
  Typography,
  Button,
} from "@mui/material";
import GoogleLoginButton from "../common/GoogleLoginButton";
import GuessLoginButton from "../common/GuessLoginButton";
import Logo from "../assets/icon.png";
import OverviewImg from "../assets/overview.jpg";
import BackgroundImage from "../assets/Background.jpg";
import { useState, useEffect } from "react";
import TruckLoader from "../common/TruckLoader";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    const isVisited = localStorage.getItem("isVisited");
    if (!isVisited) {
      setIsModalOpen(true);
      localStorage.setItem("isVisited", "true");
    }

    // Load all assets
    const loadAssets = async () => {
      const assetUrls = [Logo, OverviewImg, BackgroundImage];
      const assetPromises = assetUrls.map((url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(assetPromises);
        setAssetsLoaded(true);
      } catch (error) {
        console.error("Failed to load assets", error);
      }
    };

    loadAssets();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      xs: "95%",
      sm: 400,
      md: 600,
      lg: 700,
      xl: 800,
    },
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: "0 0.2rem 1.2rem #ffffff",
    p: 4,
    gap: 2,
    textAlign: "justify",
  };

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
      {!assetsLoaded ? (
        <TruckLoader />
      ) : (
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
            <img
              src={Logo}
              alt="logo"
              width={"90%"}
              style={{ maxWidth: 400, marginBottom: 3 }}
            />
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
      )}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Box>
            <a
              href="https://github.com/phanxuanquang/EngAce"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={OverviewImg}
                alt="Overview UI"
                style={{
                  maxHeight: 600,
                  width: "100%",
                  height: "auto",
                  borderRadius: 10,
                }}
              />
            </a>
          </Box>
          <Typography
            id="modal-description"
            sx={{
              mt: 2,
              mb: 1,
            }}
          >
            EngAce là dự án được xây dựng với mục tiêu ứng dụng trí tuệ nhân tạo
            để hỗ trợ và cá nhân hóa việc tự học tiếng Anh của người Việt. Chúng
            tôi cung cấp những tính năng ưu việt được cá nhân hóa theo trình độ
            và sở thích, nhằm tạo sự thoải mái và hứng thú trong quá trình học.
          </Typography>
          <Typography>
            <a>Thông tin chi tiết về dự án tại </a>
            <a
              href="https://github.com/phanxuanquang/EngAce?tab=readme-ov-file#-2024-university-of-information-technology--engace-project"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: "bold" }}
            >
              ĐÂY
            </a>
            .
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="primary"
              size="large"
            >
              BẮT ĐẦU
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
