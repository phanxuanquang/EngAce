export default function TermsAndConditions() {
  return (
    <p className="px-4 text-center text-sm text-muted-foreground sm:px-8">
      Bằng cách tiếp tục, bạn đồng ý với{" "}<br/>
      <a href="/terms" className="underline underline-offset-4 hover:text-primary">
        Điều khoản dịch vụ
      </a>{" "}
      và{" "}
      <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
        Chính sách bảo mật
      </a>
      .
    </p>
  );
} 