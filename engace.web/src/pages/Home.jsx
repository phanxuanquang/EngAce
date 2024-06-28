import { Box, Container, CssBaseline, Grid } from "@mui/material";
import MyBentoItem from "../common/MyBentoItem";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DrawIcon from "@mui/icons-material/Draw";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

export default function Home() {
  return (
    <Box sx={{ bgcolor: "#b3a7d6" }}>
      <CssBaseline />
      <Container fixed>
        <Box
          sx={{ height: "100vh" }}
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
            <Grid
              container
              rowSpacing={2}
              columnSpacing={2}
              sx={{ maxWidth: "90vh" }}
            >
              <Grid item xs={6}>
                <MyBentoItem
                  title="Từ điển"
                  route="/dictionary"
                  backgroundColor="#b6d8a7"
                  Icon={MenuBookIcon}
                />
              </Grid>
              <Grid item xs={6}>
                <MyBentoItem
                  title="Trắc nghiệm"
                  route="/test"
                  backgroundColor="#a2c4c8"
                  Icon={HelpOutlineIcon}
                />
              </Grid>
              <Grid item xs={6}>
                <MyBentoItem
                  title="Luyện viết"
                  route="/writing"
                  backgroundColor="#ffe59a"
                  Icon={DrawIcon}
                />
              </Grid>
              <Grid item xs={6}>
                <MyBentoItem
                  title="Tư vấn"
                  route="/chat"
                  backgroundColor="#e8999b"
                  Icon={QuestionAnswerIcon}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
