"use client";

import { Github } from "lucide-react";
import MarkdownRenderer from "../../MarkdownRenderer";
import LoadingSpinner from "../../LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: string;
  loading?: boolean;
  showGithubButton?: boolean;
}

export default function InfoDialog({
  isOpen,
  onClose,
  title = "Giới thiệu về EngAce",
  content,
  loading = false,
  showGithubButton = true,
}: InfoDialogProps) {
  const defaultContent = `
**EngAce** là nền tảng hỗ trợ học tiếng Anh **miễn phí** tích hợp AI nhằm giúp việc tự học trở nên tự nhiên và hiệu quả hơn. EngAce cá nhân hóa trải nghiệm học tập với các tính năng **độc quyền**:

- **Từ điển thông minh**: Cung cấp nghĩa, ví dụ minh họa, thành ngữ, cụm động từ và *tìm kiếm theo ngữ cảnh*, giúp hiểu sâu cách dùng từ.
- **Bài tập cá nhân hóa**: Hệ thống bộ đề được tùy biến theo trình độ lên đến 100 câu hỏi và hàng chục dạng bài tập đa dạng.
- **Luyện viết**: AI đánh giá chi tiết về ngữ pháp, phong cách và mạch lạc, đồng thời gợi ý cải thiện bài viết.
- **Gia sư ảo**: Hỗ trợ tự học tiếng Anh qua các cuộc hội thoại tương tác, tương tự như một giáo viên.

EngAce được tạo ra bởi nhóm tác giả:

- [Phan Xuân Quang](https://github.com/phanxuanquang)  
- [Bùi Minh Tuấn](https://github.com/tuan20520342) 
`.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl transform rounded-2xl bg-white dark:bg-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 bg-clip-text text-transparent">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div>
          {loading ? (
            <LoadingSpinner icon={Github} text="Đang kiểm tra cập nhật..." />
          ) : (
            <MarkdownRenderer>{content || defaultContent}</MarkdownRenderer>
          )}

         
        </div>
        <DialogFooter>
        {showGithubButton && (
            <div className="flex justify-center items-center m-auto">
              <Button
                asChild
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-200"
              >
                <a
                  href="https://github.com/phanxuanquang/EngAce"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github />
                  <span className="font-semibold">Dự án trên GitHub</span>
                </a>
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
