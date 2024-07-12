import {
  Box,
  Container,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogActions,
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
    }

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

  const handleCloseButton = () => {
    setIsModalOpen(false);
    localStorage.setItem("isVisited", "true");
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
          {!assetsLoaded ? (
            <TruckLoader />
          ) : (
            <img
              src={Logo}
              alt="logo"
              width={"90%"}
              style={{ maxWidth: 400, marginBottom: 3 }}
            />
          )}

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

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        sx={{
          borderRadius: 2,
        }}
      >
        <DialogContent>
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
          <Typography sx={{ mt: 2, mb: 1, textAlign: "justify" }}>
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
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mb: 2.5, p: 0 }}>
          <Button
            onClick={handleCloseButton}
            variant="contained"
            color="primary"
            size="large"
          >
            BẮT ĐẦU
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
