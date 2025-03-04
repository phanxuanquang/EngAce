import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ | EngAce",
  description: "Điều khoản dịch vụ của EngAce",
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-8">Điều khoản dịch vụ</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>1. Chấp nhận điều khoản</h2>
        <p>
          Bằng cách truy cập và sử dụng EngAce, bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản và điều kiện này.
        </p>

        <h2>2. Mô tả dịch vụ</h2>
        <p>
          EngAce là một nền tảng học tiếng Anh trực tuyến sử dụng công nghệ AI. Chúng tôi cung cấp các công cụ và tài nguyên để hỗ trợ việc học tiếng Anh của bạn.
        </p>

        <h2>3. Tài khoản người dùng</h2>
        <p>
          Để sử dụng đầy đủ các tính năng của EngAce, bạn cần cung cấp thông tin chính xác và cập nhật. Bạn chịu trách nhiệm bảo mật thông tin tài khoản của mình.
        </p>

        <h2>4. Quyền sở hữu trí tuệ</h2>
        <p>
          Tất cả nội dung trên EngAce, bao gồm văn bản, hình ảnh, logo, và phần mềm đều thuộc quyền sở hữu của chúng tôi hoặc các bên cấp phép.
        </p>

        <h2>5. Giới hạn trách nhiệm</h2>
        <p>
          EngAce được cung cấp "nguyên trạng" và chúng tôi không đảm bảo rằng dịch vụ sẽ không bị gián đoạn hoặc không có lỗi.
        </p>

        <h2>6. Thay đổi điều khoản</h2>
        <p>
          Chúng tôi có quyền sửa đổi các điều khoản này vào bất kỳ lúc nào. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
        </p>

        <h2>7. Liên hệ</h2>
        <p>
          Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ này, vui lòng liên hệ với chúng tôi qua email: support@engace.com
        </p>
      </div>
    </div>
  );
} 