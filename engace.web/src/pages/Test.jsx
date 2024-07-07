import { Box, Typography } from "@mui/material";
import TestGenerateForm from "../components/TestGenerateForm";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as SagaActionTypes from "../redux/constants";
import QuestionAndAnswer from "../components/QuestionAndAnswer";

export default function Test() {
  const dispatch = useDispatch();
  const { qaList } = useSelector((state) => state.quizSlice);

  useEffect(() => {
    dispatch({
      type: SagaActionTypes.GET_QUIZ_TYPES,
      onLoading: () => {},
      onFinish: () => {},
    });
  }, [dispatch]);

  if (qaList.length > 0) {
    return <QuestionAndAnswer />;
  }

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
