import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function DistionarySearchForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [keyword, setSearch] = useState(searchParams.get("keyword") ?? "");
  const [context, setContext] = useState(searchParams.get("context") ?? "");
  const [mode, setMode] = useState(
    searchParams.get("useEnglishToExplain") === "true" ? true : false
  );

  const handleSearch = () => {
    if (keyword && context) {
      navigate(
        `?keyword=${encodeURIComponent(
          keyword.trim()
        )}&context=${encodeURIComponent(
          context.trim()
        )}&useEnglishToExplain=${mode}`
      );
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} sx={{ width: "100%" }}>
      <Typography variant="h1" textAlign={"center"}>
        Từ điển
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="body1"
          component={InputLabel}
          required
          htmlFor="search"
          sx={{ color: "black" }}
        >
          Từ hoặc cụm từ cần tra
        </Typography>
        <FormControl fullWidth>
          <TextField
            id="search"
            variant="outlined"
            placeholder="Hello"
            value={keyword}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FormControl>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="body1"
          component={InputLabel}
          htmlFor="context"
          sx={{ color: "black" }}
        >
          Ngữ cảnh
        </Typography>
        <FormControl fullWidth>
          <TextField
            id="context"
            variant="outlined"
            placeholder="Hello World"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </FormControl>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="body1"
          component={InputLabel}
          htmlFor="mode"
          id="mode-label"
          color={"black"}
        >
          Loại từ điển
        </Typography>
        <FormControl fullWidth>
          <Select
            labelId="mode-label"
            id="mode"
            defaultValue={false}
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <MenuItem value={true}>Anh - Anh</MenuItem>
            <MenuItem value={false}>Anh - Việt</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button
        variant="contained"
        sx={{ width: "fit-content", alignSelf: "center" }}
        size="large"
        disabled={!keyword.trim()}
        onClick={handleSearch}
      >
        Tra Cứu
      </Button>
    </Box>
  );
}
