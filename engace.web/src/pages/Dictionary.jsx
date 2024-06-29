import { Box } from "@mui/material";
import DistionarySearchForm from "../components/DistionarySearchForm";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { AppService } from "../services/api";

export default function Dictionary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const context = searchParams.get("context");
  const useEnglishToExplain = searchParams.get("useEnglishToExplain");

  useEffect(() => {
    if (useEnglishToExplain !== "true" && useEnglishToExplain !== "false") {
      setSearchParams((prev) => ({
        ...Object.fromEntries(prev.entries()),
        useEnglishToExplain: false,
      }));
    }
    const fetchDictionarySearch = async () => {
      try {
        if (keyword) {
          const response = await AppService.getDictionarySearch(
            keyword,
            context,
            useEnglishToExplain
          );
          if (response.status === 200) {
            console.log(response.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDictionarySearch();
  }, [keyword, context, useEnglishToExplain, setSearchParams]);

  return (
    <Box
      sx={{ height: "100%", width: "80%", margin: "auto" }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <DistionarySearchForm />
    </Box>
  );
}
