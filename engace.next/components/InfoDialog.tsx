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
## Giới thiệu về EngAce  

**EngAce** là nền tảng **miễn phí** sử dụng trí tuệ nhân tạo để nâng tầm trải nghiệm học tiếng Anh cho người Việt. Với mục tiêu mang lại phương pháp học hiệu quả, cá nhân hóa và thú vị, EngAce kết hợp sức mạnh của AI với bộ công cụ phong phú, giúp người dùng nâng cao kỹ năng tiếng Anh một cách toàn diện.  

Ứng dụng được thiết kế để đáp ứng nhu cầu học tập đa dạng của từng cá nhân, từ việc tra cứu từ điển thông minh, luyện tập qua các bài kiểm tra tùy chỉnh, đến cải thiện kỹ năng viết và trò chuyện với trợ lý AI. Tất cả đều hướng đến việc giúp người học tiếp cận tiếng Anh theo cách tự nhiên nhất, giảm bớt khó khăn và nâng cao khả năng sử dụng ngôn ngữ một cách linh hoạt.  

### Các tính năng chính  

- **Từ điển thông minh**: Cung cấp nghĩa chi tiết, ví dụ minh họa, thành ngữ, cụm động từ, cùng với khả năng tìm kiếm theo ngữ cảnh để giúp người dùng hiểu sâu hơn về cách sử dụng từ.  
- **Bài tập cá nhân hóa**: Hệ thống bài tập trắc nghiệm tự động điều chỉnh theo trình độ người học, hỗ trợ lên đến 100 câu hỏi mỗi lần và 12 dạng bài tập khác nhau.  
- **Đánh giá và cải thiện kỹ năng viết**: AI cung cấp phản hồi chi tiết về ngữ pháp, phong cách và tính mạch lạc trong bài viết, đồng thời đưa ra gợi ý cải thiện giúp người học nâng cao khả năng viết tiếng Anh.  
- **Trò chuyện với gia sư ảo**: Trợ lý ảo hỗ trợ học tiếng Anh thông qua các cuộc hội thoại tương tác, cung cấp mẹo học tập và giải đáp thắc mắc liên quan đến ngôn ngữ.  

### Nhóm tác giả  

EngAce được phát triển bởi nhóm sinh viên trường Đại học Công nghệ Thông tin, với mong muốn tạo ra một công cụ hỗ trợ học tiếng Anh hiệu quả hơn:  

- **[Phan Xuân Quang](https://github.com/phanxuanquang)** – Thiết kế sản phẩm, phát triển backend, DevOps, tinh chỉnh mô hình AI.  
- **[Bùi Minh Tuấn](https://github.com/tuan20520342)** – Phát triển frontend, đảm bảo trải nghiệm người dùng mượt mà và tối ưu.  
`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl transform rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mt-2">
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
