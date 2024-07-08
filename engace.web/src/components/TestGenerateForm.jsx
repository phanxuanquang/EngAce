import { Grid, Divider } from "@mui/material";
import { memo, useState } from "react";
import SuggestTopicInput from "./SuggestTopicInput";
import QuestionsQuantity from "./QuestionsQuantity";
import QuestionsTypeForm from "./QuestionsTypeForm";
import { useDispatch } from "react-redux";
import * as SagaActionTypes from "../redux/constants";
import { LoadingButton } from "@mui/lab";
import DoneIcon from "@mui/icons-material/Check";

const MemoizedSuggestTopicInput = memo(SuggestTopicInput);
const MemoizedQuestionsQuantity = memo(QuestionsQuantity);
const MemoizedQuestionsTypeForm = memo(QuestionsTypeForm);

export default function TestGenerateForm() {
  const dispatch = useDispatch();
  const [topic, setTopic] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [types, setTypes] = useState({});
  const level = localStorage.getItem("level");
  const [errorTopic, setErrorTopic] = useState("");
  const [errorQuantity, setErrorQuantity] = useState("");
  const [errorTypes, setErrorTypes] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQuiz = () => {
    const qTypes = Object.keys(types)
      .filter((key) => types[key])
      .map(Number);

    dispatch({
      type: SagaActionTypes.GENERATE_QUIZ,
      topic: topic,
      qTypes: qTypes,
      level: level,
      quantity: quantity,
      onLoading: () => setLoading(true),
      onFinish: () => setLoading(false),
    });
  };

  const handleGenerateQuiz = () => {
    let hasError = false;

    if (topic === "") {
      setErrorTopic("Vui lòng nhập chủ đề");
      hasError = true;
    } else {
      setErrorTopic("");
    }

    if (quantity < 10 || quantity > 40) {
      setErrorQuantity("Số lượng câu hỏi phải từ 10 đến 40");
      hasError = true;
    } else {
      setErrorQuantity("");
    }

    if (
      Object.keys(types).length === 0 ||
      Object.values(types).every((val) => !val)
    ) {
      setErrorTypes("Vui lòng chọn ít nhất một loại câu hỏi");
      hasError = true;
    } else {
      setErrorTypes("");
    }

    if (!hasError) {
      generateQuiz();
    }
  };

  return (
    <Grid container spacing={2} sx={{ overflow: "auto" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingRight: 4,
        }}
      >
        <MemoizedSuggestTopicInput
          topic={topic}
          setTopic={setTopic}
          error={errorTopic}
        />
        <MemoizedQuestionsQuantity
          quantity={quantity}
          setQuantity={setQuantity}
          error={errorQuantity}
        />
      </Grid>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ mr: "-1px", display: { xs: "none", md: "block" } }}
      />

      <Grid item xs={12} md={6}>
        <MemoizedQuestionsTypeForm
          types={types}
          setTypes={setTypes}
          error={errorTypes}
        />
      </Grid>
      <Grid item xs={12} display={"flex"} justifyContent={"center"} sx={{ marginBottom: 3 }}>
        <LoadingButton
          sx={{ textTransform: "none" }}
          loading={loading}
          loadingPosition="end"
          endIcon={<DoneIcon />}
          variant="contained"
          onClick={handleGenerateQuiz}
        >
          Tạo câu hỏi
        </LoadingButton>
      </Grid>
    </Grid>
  );
}
