import { Box, Container, CssBaseline, Grid } from "@mui/material";
import MyBentoItem from "../common/MyBentoItem";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import DrawIcon from "@mui/icons-material/Draw";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import BackgroundImage from '../assets/Background1.jpg';


export default function Home() {
  return (
    <Box
    sx={{
      backgroundImage: `url(${BackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
    }}
    >
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
                  backgroundColor="#34A853"
                  Icon={MenuBookIcon}
                />
              </Grid>
              <Grid item xs={6}>
                <MyBentoItem
                  title="Bài tập"
                  route="/test"
                  backgroundColor="#4285F4"
                  Icon={QuizIcon}
                />
              </Grid>
              <Grid item xs={6}>
                <MyBentoItem
                  title="Luyện viết"
                  route="/writing"
                  backgroundColor="#FBBC04"
                  Icon={DrawIcon}
                />
              </Grid>
              <Grid item xs={6}>
                <MyBentoItem
                  title="Tư vấn"
                  route="/chat"
                  backgroundColor="#EA4335"
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
