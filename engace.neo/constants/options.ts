export const GENDER_OPTIONS = [
  {
    label: "Nam",
    value: "male",
  },
  {
    label: "Nữ",
    value: "female",
  },
  {
    label: "Khác",
    value: "other",
  },
] as const;

export const CEFR_OPTIONS = [
  {
    label: "A1 - Sơ cấp",
    value: 1,
    description:
      "Đọc hiểu các từ vựng cơ bản và câu ngắn đơn giản liên quan đến thông tin cá nhân (tên, tuổi, quốc tịch), biển báo, thực đơn, lịch trình. Có thể viết câu đơn độc lập để trình bày thông tin cá nhân như 'Tôi tên là...', 'Tôi sống ở...', hoặc điền mẫu biểu đơn giản.",
  },
  {
    label: "A2 - Tiền trung cấp",
    value: 2,
    description:
      "Đọc hiểu đoạn văn ngắn mô tả người, địa điểm, hoạt động quen thuộc như thư cá nhân, hướng dẫn sử dụng đơn giản. Có thể viết đoạn văn gồm 3-5 câu nối tiếp nhau, mô tả trải nghiệm hàng ngày, thói quen, hoặc kế hoạch ngắn hạn bằng ngôn ngữ đơn giản, rõ ràng.",
  },
  {
    label: "B1 - Trung cấp",
    value: 3,
    description:
      "Đọc hiểu văn bản dài hơn có cấu trúc rõ ràng như thư từ, bài viết trên blog, nội dung mô tả sản phẩm/dịch vụ. Có thể viết đoạn văn khoảng 100–150 từ, diễn đạt suy nghĩ, cảm xúc, ý kiến về các chủ đề quen thuộc như sở thích, công việc, trải nghiệm học tập, sử dụng câu ghép, câu phức đơn giản.",
  },
  {
    label: "B2 - Cao trung cấp",
    value: 4,
    description:
      "Đọc hiểu văn bản phức tạp hơn như bài báo, báo cáo chuyên ngành phổ thông, và đánh giá được lập luận, quan điểm trong bài viết. Có thể viết bài luận, báo cáo, email chuyên nghiệp với lập luận rõ ràng, ví dụ minh họa, và sử dụng linh hoạt các cấu trúc câu phức tạp, từ vựng học thuật cơ bản.",
  },
  {
    label: "C1 - Cao cấp",
    value: 5,
    description:
      "Đọc hiểu các loại văn bản đa dạng, dài và phức tạp như bài nghiên cứu, hợp đồng, văn bản pháp lý, nhận diện được ẩn ý, quan điểm tác giả. Có thể viết văn bản học thuật hoặc chuyên môn (bài luận, báo cáo phân tích, đề xuất dự án) với ngôn ngữ chính xác, mạch lạc, có tính thuyết phục và phù hợp với từng ngữ cảnh cụ thể.",
  },
  {
    label: "C2 - Thành thạo",
    value: 6,
    description:
      "Đọc hiểu thành thạo mọi thể loại văn bản, kể cả văn chương, triết học, tài liệu chuyên ngành sâu, và phân tích sắc thái, phong cách viết. Có thể viết văn bản dài, phức tạp về bất kỳ chủ đề nào với độ chính xác cao, sử dụng ngôn ngữ linh hoạt, phong cách đa dạng, gần như không mắc lỗi, đạt chuẩn người bản xứ.",
  },
] as const;
