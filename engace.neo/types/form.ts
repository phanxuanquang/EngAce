import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(2, "Tên của bạn quá ngắn").max(50, "Tên của bạn quá dài"),
  age: z.number().min(6, "Không hỗ trợ người dùng dưới 6 tuổi").max(70, "Không hỗ trợ người dùng trên 70 tuổi"),
  gender: z.enum(["male", "female", "secret"], {
    required_error: "Vui lòng chọn giới tính của bạn",
  }),
  geminiApiKey: z.string().min(1, "API key is required"),
  englishLevel: z.number({
    required_error: "Vui lòng chọn trình độ tiếng Anh của bạn",
  }).min(1, "Invalid level").max(6, "Invalid level"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Bạn cần đồng ý với điều khoản dịch vụ",
  }),
});

export type RegistrationForm = z.infer<typeof registrationSchema>;
