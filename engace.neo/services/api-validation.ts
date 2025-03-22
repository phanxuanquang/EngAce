import axios from "axios";

export interface ValidationResponse {
  success: boolean;
  error?: string;
}

export const validateGeminiApiKey = async (
  apiKey: string
): Promise<ValidationResponse> => {
  try {
    // Test the API key by making a simple request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: "test" }] }],
      }
    );

    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.status === 401
            ? "API Key không hợp lệ"
            : "Error validating API key",
      };
    }
    return { success: false, error: "Unexpected error occurred" };
  }
};
