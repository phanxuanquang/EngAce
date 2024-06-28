import MenuBookIcon from "@mui/icons-material/MenuBook";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DrawIcon from "@mui/icons-material/Draw";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

const navConfig = [
  {
    title: "Từ điển",
    path: "/dictionary",
    icon: <MenuBookIcon />,
  },
  {
    title: "Trắc nghiệm",
    path: "/test",
    icon: <HelpOutlineIcon />,
  },
  {
    title: "Luyện viết",
    path: "/writing",
    icon: <DrawIcon />,
  },
  {
    title: "Tư vấn",
    path: "/chat",
    icon: <QuestionAnswerIcon />,
  },
];

export default navConfig;
