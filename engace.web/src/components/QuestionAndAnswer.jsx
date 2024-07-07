import { Divider, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import QuestionRadioGroup from "./QuestionRadioGroup";
import { useState } from "react";
import QuestionIndex from "./QuestionIndex";
import QuizzStatus from "./QuizzStatus";

export default function QuestionAndAnswer() {
  const { qaList } = useSelector((state) => state.quizSlice);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState([]);
  const [submit, setSubmit] = useState(false);

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        md={9}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingRight: 4,
        }}
      >
        <QuestionIndex
          index={index}
          length={qaList.length}
          setIndex={setIndex}
        />
        <Divider />
        <QuestionRadioGroup
          question={qaList[index]}
          answer={answer}
          index={index}
          setAnswer={setAnswer}
          submit={submit}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <QuizzStatus
          qaList={qaList}
          answer={answer}
          setIndex={setIndex}
          index={index}
          submit={submit}
          setSubmit={setSubmit}
        />
      </Grid>
    </Grid>
  );
}
