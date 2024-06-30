import {
  Box,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";

export default function WritingForm({ onClosePannel }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState(searchParams.get("content") ?? "");

  const handleSearch = () => {
    if (content) {
      navigate(`?content=${encodeURIComponent(content.trim())}`);
      onClosePannel ? onClosePannel(false) : null;
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} sx={{ width: "100%" }}>
      <Typography variant="h1" textAlign={"center"}>
        Luyện viết
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="body1"
          component={InputLabel}
          required
          htmlFor="search"
          sx={{ color: "black" }}
        >
          Nội dung bài viết của bạn
        </Typography>
        <FormControl fullWidth>
          <TextField
            id="search"
            variant="outlined"
            placeholder="Ex: Cats are fascinating creatures known for their independence and playful nature. Domesticated around 9,000 years ago, they have been revered in various cultures, particularly in ancient Egypt where they were considered sacred. Today, cats are cherished pets, offering companionship and joy to millions of households worldwide. "
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={12}
          />
        </FormControl>
      </Box>
      <Button
        variant="contained"
        sx={{ width: "fit-content", alignSelf: "center" }}
        size="large"
        disabled={!content.trim()}
        onClick={handleSearch}
      >
        Đánh giá
      </Button>
    </Box>
  );
}

WritingForm.propTypes = {
  onClosePannel: PropTypes.func,
};
