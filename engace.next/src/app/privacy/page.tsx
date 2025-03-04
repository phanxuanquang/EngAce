import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | EngAce",
  description: "Chính sách bảo mật của EngAce",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-8">Chính sách bảo mật</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>1. Thu thập thông tin</h2>
        <p>
          Chúng tôi thu thập các thông tin cá nhân mà bạn cung cấp cho chúng tôi, bao gồm:
        </p>
        <ul>
          <li>Họ và tên</li>
          <li>Tuổi</li>
          <li>Giới tính</li>
          <li>Thông tin liên hệ</li>
          <li>Dữ liệu học tập và tương tác với nền tảng</li>
        </ul>

        <h2>2. Sử dụng thông tin</h2>
        <p>
          Chúng tôi sử dụng thông tin thu thập được để:
        </p>
        <ul>
          <li>Cung cấp và cải thiện dịch vụ</li>
          <li>Cá nhân hóa trải nghiệm học tập</li>
          <li>Phân tích và nghiên cứu</li>
          <li>Liên lạc với bạn về dịch vụ</li>
        </ul>

        <h2>3. Bảo mật thông tin</h2>
        <p>
          Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và áp dụng các biện pháp bảo mật phù hợp để ngăn chặn truy cập trái phép.
        </p>

        <h2>4. Chia sẻ thông tin</h2>
        <p>
          Chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ khi:
        </p>
        <ul>
          <li>Được sự đồng ý của bạn</li>
          <li>Theo yêu cầu pháp lý</li>
          <li>Để bảo vệ quyền lợi của chúng tôi</li>
        </ul>

        <h2>5. Quyền của người dùng</h2>
        <p>
          Bạn có quyền:
        </p>
        <ul>
          <li>Truy cập thông tin cá nhân của mình</li>
          <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
          <li>Yêu cầu xóa thông tin</li>
          <li>Phản đối việc xử lý thông tin của bạn</li>
        </ul>

        <h2>6. Cookie và công nghệ theo dõi</h2>
        <p>
          Chúng tôi sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm của bạn và thu thập dữ liệu phân tích.
        </p>

        <h2>7. Thay đổi chính sách</h2>
        <p>
          Chúng tôi có thể cập nhật chính sách này và sẽ thông báo cho bạn về những thay đổi quan trọng.
        </p>

        <h2>8. Liên hệ</h2>
        <p>
          Nếu bạn có thắc mắc về chính sách bảo mật của chúng tôi, vui lòng liên hệ: privacy@engace.com
        </p>
      </div>
    </div>
  );
} 