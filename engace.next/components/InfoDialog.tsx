"use client";
import { X, Github } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoDialog({ isOpen, onClose }: InfoDialogProps) {
  if (!isOpen) return null;

  const content = `
**EngAce** là nền tảng hỗ trợ học tiếng Anh **miễn phí** tích hợp AI, với mục tiêu giúp việc tự học trở nên tự nhiên và hiệu quả hơn. EngAce cá nhân hóa trải nghiệm học tập với các tính năng **độc quyền** như:

- **Từ điển thông minh**: Cung cấp nghĩa, ví dụ minh họa, thành ngữ, cụm động từ và *tìm kiếm theo ngữ cảnh*, giúp hiểu sâu cách dùng từ.
- **Bài tập cá nhân hóa**: Hệ thống bộ đề được tùy biến theo trình độ lên đến 100 câu hỏi và hàng chục dạng bài tập đa dạng.
- **Luyện viết**: AI đánh giá chi tiết về ngữ pháp, phong cách và mạch lạc, đồng thời gợi ý cải thiện bài viết.
- **Gia sư ảo**: Hỗ trợ tự học tiếng Anh qua các cuộc hội thoại tương tác, tương tự như một giáo viên.

EngAce được tạo ra bởi nhóm tác giả:

- [Phan Xuân Quang](https://github.com/phanxuanquang)  
- [Bùi Minh Tuấn](https://github.com/tuan20520342) 
`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl transform rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center pb-1">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">Giới thiệu về EngAce</h1>
        <button
          onClick={onClose}
          className="p-3 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
        <div>
          <MarkdownRenderer>{content}</MarkdownRenderer>
          <div className="flex justify-center mt-8">
            
            <button>
              <a
                href="https://github.com/phanxuanquang/EngAce"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-200"
              >
                <Github className="font-semibold" />
                <span className="font-semibold">Ủng hộ dự án trên GitHub</span>
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
