import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

export default function QuestionRadioGroup({
  question,
  answer,
  index: qIndex,
  setAnswer,
  submit,
}) {
  const handleChange = (event) => {
    const newAnswer = [...answer];
    newAnswer[qIndex] = event.target.value;
    setAnswer(newAnswer);
  };

  return (
    <FormControl disabled={submit}>
      <FormLabel>
        <Typography
          variant="body1"
          sx={{ color: "black !important" }}
        >
          {question.Question}
        </Typography>
      </FormLabel>
      <RadioGroup
        name="radio-buttons-group"
        onChange={handleChange}
        value={answer[qIndex] || ""}
      >
        {question.Options.map((option, index) => (
          <FormControlLabel
            key={option}
            value={index}
            control={<Radio />}
            label={
              <Typography
                sx={{
                  color: !submit
                    ? "black"
                    : question.RightOptionIndex === index
                    ? "green"
                    : "grey",
                  fontWeight: !submit
                    ? "normal"
                    : question.RightOptionIndex === index
                    ? "bold"
                    : "normal",
                }}
              >
                {option}
              </Typography>
            }
          />
        ))}
      </RadioGroup>
      {submit && <Typography>{question.ExplanationInVietnamese}</Typography>}
    </FormControl>
  );
}
QuestionRadioGroup.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  setAnswer: PropTypes.func.isRequired,
  submit: PropTypes.bool.isRequired,
};
