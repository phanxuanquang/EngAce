import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Hidden,
  Typography,
} from "@mui/material";
import WritingForm from "../components/WritingForm";
import { useSearchParams } from "react-router-dom";
import { AppService } from "../services/api";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatLoader from "../common/ChatLoader";

export default function Writing() {
  const [searchParams] = useSearchParams();
  const content = searchParams.get("content");
  const level = localStorage.getItem("level");
  const [review, setReview] = useState({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCloseAccordion = () => () => {
    setExpanded((pre) => !pre);
  };

  useEffect(() => {
    const fetchEssayReview = async () => {
      try {
        if (content) {
          setLoading(true);
          const response = await AppService.getEssayReview(content, level);
          if (response.status === 200) {
            console.log(response.data);
            setReview(response.data);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEssayReview();
  }, [content, level]);

  if (content) {
    return (
      <Box
        sx={{
          height: "100%",
          overflow: "auto",
        }}
      >
        <Grid container columnSpacing={4}>
          <Hidden mdDown>
            <Grid item xs={6}>
              <Box sx={{ position: "sticky", top: 0 }}>
                <WritingForm />
              </Box>
            </Grid>
          </Hidden>
          <Grid item xs={12} md={6}>
            <Hidden mdUp>
              <Accordion
                sx={{
                  padding: 0,
                  position: "sticky",
                  top: 0,
                  zIndex: 100,
                  boxShadow: "1px 1px 1px 1px #ccc",
                }}
                expanded={expanded}
                onChange={handleCloseAccordion()}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{ bgcolor: "#f5f5f5", borderRadius: 0 }}
                >
                  Bài viết của bạn
                </AccordionSummary>
                <AccordionDetails>
                  <WritingForm onClosePannel={setExpanded} />
                </AccordionDetails>
              </Accordion>
            </Hidden>

            {!loading ? (
              <>
                <Accordion
                  sx={{
                    padding: 0,
                    marginBottom: 2,
                  }}
                  defaultExpanded
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ bgcolor: "#f5f5f5", borderRadius: 0 }}
                  >
                    Nhận xét
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography paragraph>{review?.GeneralComment}</Typography>
                  </AccordionDetails>
                </Accordion>
                <Typography paragraph>{review?.ImprovedContent}</Typography>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 4,
                }}
              >
                <ChatLoader />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "80%",
        margin: "auto",
      }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <WritingForm />
    </Box>
  );
}
