import { Box, Typography } from "@mui/material";
import TestGenerateForm from "../components/TestGenerateForm";

export default function Test() {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h2">Trắc nghiệm</Typography>
      <TestGenerateForm />
    </Box>
  );
}
