import { Brain, MessageSquare, BarChart, ListTodo, BookOpenCheck, NotebookPen, Pen, MessageCircle } from "lucide-react";

export const WEBSITE_FEATURES = [
  {
    title: "Bài tập cá nhân hóa",
    content: "Chủ đề tùy ý, bài tập nhiều dạng, luyện đề mọi lúc",
    image: "https://i.imgur.com/to3NHdG.png",
    icon: ListTodo
  },
  {
    title: "Từ điển biết tuốt",
    content: "Tra sâu, hiểu kỹ, ngữ cảnh rõ ràng, không cần mò mẫm!",
    image: "https://i.imgur.com/EU9PHiR.png",
    icon: BookOpenCheck
  },
  {
    title: "Luyện viết thông minh",
    content: "Nhận phản hồi chi tiết và góp ý cải thiện tức thì từ trợ giảng AI",
    image: "https://i.imgur.com/nIiYJQM.png",
    icon: Pen
  },
  {
    title: "Hỏi đáp cùng gia sư ảo",
    content: "Hỏi đáp linh hoạt, tư vấn tận tình, tra cứu tự động, tư duy sâu sắc và hỗ trợ hình ảnh",
    image: "https://i.imgur.com/Qkq8vcz.png",
    icon: MessageCircle
  }
] as const;
