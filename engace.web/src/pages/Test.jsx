import { Box, Typography } from "@mui/material";
import TestGenerateForm from "../components/TestGenerateForm";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as SagaActionTypes from "../redux/constants";

export default function Test() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: SagaActionTypes.GET_QUIZ_TYPES,
      onLoading: () => {},
      onFinish: () => {},
    });
  }, [dispatch]);

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
      gap={2}
    >
      <Typography variant="h2">BÀI TẬP</Typography>
      <TestGenerateForm />
    </Box>
  );
}
