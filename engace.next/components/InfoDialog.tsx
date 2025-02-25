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
**EngAce** là nền tảng **miễn phí** sử dụng AI để nâng tầm trải nghiệm học tiếng Anh dành riêng cho người Việt. Nền tảng được thiết kế để đáp ứng nhu cầu học tập đa dạng của từng cá nhân, từ việc tra cứu từ điển thông minh, luyện tập qua các bài kiểm tra tùy chỉnh, đến cải thiện kỹ năng viết và trò chuyện với trợ lý AI. Tất cả đều hướng đến việc giúp người học tiếp cận tiếng Anh theo cách tự nhiên nhất, giảm bớt khó khăn và nâng cao khả năng sử dụng ngôn ngữ một cách linh hoạt.  

### Tính năng chính  

- **Từ điển thông minh**: Cung cấp nghĩa chi tiết, ví dụ minh họa, thành ngữ, cụm động từ, cùng với khả năng tìm kiếm theo ngữ cảnh để giúp người dùng hiểu sâu hơn về cách sử dụng từ.  
- **Bài tập cá nhân hóa**: Hệ thống bài tập trắc nghiệm tự động điều chỉnh theo trình độ người học, hỗ trợ lên đến 100 câu hỏi mỗi lần và lên đến 12 dạng bài tập khác nhau.  
- **Luyện viết**: AI cung cấp phản hồi chi tiết về ngữ pháp, phong cách và tính mạch lạc trong bài viết, đồng thời đưa ra gợi ý cải thiện bài viết.  
- **Trò chuyện với gia sư ảo**: Trợ lý ảo hỗ trợ học tiếng Anh thông qua các cuộc hội thoại tương tác.  

### Tác giả  

EngAce được phát triển bởi nhóm sinh viên trường **Đại học Công nghệ Thông tin**:  

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
