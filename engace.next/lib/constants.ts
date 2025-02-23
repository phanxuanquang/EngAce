export const PROFICIENCY_LEVELS = [
  {
    id: 1,
    name: "Beginner",
    description: "Bạn có thể hiểu và sử dụng các cụm từ quen thuộc hàng ngày và các câu cơ bản. Bạn có thể giới thiệu bản thân và người khác, hỏi và trả lời về thông tin cá nhân.",
  },
  {
    id: 2,
    name: "Elementary",
    description: "Bạn có thể hiểu được các câu và cụm từ thường gặp liên quan đến các lĩnh vực cơ bản. Bạn có thể mô tả đơn giản về bản thân, môi trường xung quanh và các vấn đề thuộc nhu cầu thiết yếu.",
  },
  {
    id: 3,
    name: "Intermediate",
    description: "Bạn có thể hiểu được các ý chính của văn bản phổ thông. Bạn có thể xử lý hầu hết các tình huống khi đi du lịch. Bạn có thể viết văn bản đơn giản về các chủ đề quen thuộc.",
  },
  {
    id: 4,
    name: "Upper Intermediate",
    description: "Bạn có thể hiểu ý chính của văn bản phức tạp. Bạn có thể giao tiếp trôi chảy và tự nhiên với người bản ngữ. Bạn có thể viết văn bản chi tiết về nhiều chủ đề khác nhau.",
  },
  {
    id: 5,
    name: "Advanced",
    description: "Bạn có thể hiểu được các văn bản dài và phức tạp. Bạn có thể diễn đạt trôi chảy và tự nhiên. Bạn có thể sử dụng ngôn ngữ linh hoạt và hiệu quả cho các mục đích xã hội, học thuật và chuyên môn.",
  },
  {
    id: 6,
    name: "Mastery",
    description: "Bạn có thể hiểu dễ dàng hầu hết mọi thứ nghe hoặc đọc được. Bạn có thể tóm tắt thông tin từ các nguồn nói và viết khác nhau. Bạn có thể diễn đạt rất trôi chảy và chính xác.",
  },
] as const

export type ProficiencyLevel = typeof PROFICIENCY_LEVELS[number]