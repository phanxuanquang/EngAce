import MarkdownRenderer from "@/components/MarkdownRenderer";

interface FirstVisitGuideProps {
  onClose: () => void;
}

const GUIDE_CONTENT = `# Trò chuyện cùng gia sư ảo

Đây là nơi bạn có thể tương tác với gia sư ảo để:

* Tham gia các cuộc thảo luận về nhiều chủ đề học tiếng Anh
* Nhận lời khuyên và mẹo để vượt qua các thách thức trong học tập
* Đặt câu hỏi và nhận câu trả lời chi tiết về việc học tiếng Anh

## Tính năng đặc biệt:

* Hỗ trợ định dạng Markdown cho văn bản phong phú
* Trả lời nhanh chóng và chính xác
* Tương tác bằng cả tiếng Việt và tiếng Anh
* Lưu trữ lịch sử trò chuyện trong phiên làm việc`;

export default function FirstVisitGuide({ onClose }: FirstVisitGuideProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg transform rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
        <div className="mb-6">
          <div className="prose dark:prose-invert max-w-none">
            <MarkdownRenderer>{GUIDE_CONTENT}</MarkdownRenderer>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-gradient-to-r from-orange-700 to-amber-600 px-4 py-3 text-white hover:from-orange-700 hover:to-amber-700 transition-all duration-200 font-medium"
        >
          Bắt đầu trò chuyện
        </button>
      </div>
    </div>
  );
}