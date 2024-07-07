import { Box, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function QuestionIndex({ index, length, setIndex }) {
  const handleBack = () => {
    setIndex(index - 1);
  };

  const handleNext = () => {
    setIndex(index + 1);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button disabled={index === 0} onClick={handleBack}>
        BACK
      </Button>
      <Typography>
        {index + 1} / {length}
      </Typography>
      <Button disabled={index === length - 1} onClick={handleNext}>
        NEXT
      </Button>
    </Box>
  );
}

QuestionIndex.propTypes = {
  index: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  setIndex: PropTypes.func.isRequired,
};
