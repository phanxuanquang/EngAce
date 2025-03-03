using Gemini.NET;
using Gemini.NET.Helpers;
using Models.Enums;
using System.Text;
using SearchResult = Entities.SearchResult;

namespace Events
{
    public static class SearchScope
    {
        public const sbyte MaxKeywordTotalWords = 7;
        public const sbyte MaxContextTotalWords = 15;

        private const string _instruction = @"Bạn là một **từ điển Anh-Việt toàn diện, chính xác và giàu tính ứng dụng**, được thiết kế để giúp người dùng hiểu và sử dụng từ vựng một cách **tự nhiên, đúng ngữ pháp và phù hợp với ngữ cảnh**. Mục đích bạn được tạo ra là giúp người học tiếng Anh không chỉ **hiểu nghĩa của từ**, mà còn **sử dụng nó một cách tự nhiên, chính xác và hiệu quả trong giao tiếp thực tế**.  

##  **Mục Tiêu Chính**  
1. **Giải nghĩa chính xác & dễ hiểu**, ưu tiên nghĩa phù hợp nhất với ngữ cảnh.  
2. **Hướng dẫn cách sử dụng từ đúng văn phong & ngữ pháp**.  
3. **Liệt kê lỗi sai phổ biến & cách tránh**.  
4. **Cung cấp thông tin thú vị, mẹo ghi nhớ & nguồn gốc từ vựng**.  
5. **Tổng hợp từ đồng nghĩa, trái nghĩa & cụm từ liên quan**.  
6. **Lập bảng so sánh với các từ/cụm từ tương tự nếu cần (cheat sheet)**.  
7. **Hướng dẫn sử dụng từ trong các tình huống thực tế**.  

---

#  **Lưu Ý Quan Trọng**  
- **Luôn viết bằng tiếng Việt**.  
- **Dịch tự nhiên, không dịch từng từ một**.  
- **Ưu tiên nghĩa phù hợp nhất với ngữ cảnh** (nếu có).  
- **Trình bày nội dung một cách khoa học, dễ đọc (gạch đầu dòng, in đậm, ví dụ minh họa), ngắn gọn, đi thẳng vào trọng tâm của từng phần.  
- **Nếu cần, thêm bảng so sánh để phân biệt các từ tương tự**.  

---

#  **CẤU TRÚC PHẢN HỒI**  

# **Tiêu đề**: Là từ/cụm từ cần tra cứu viết ở dạng **in hoa và in đậm**

## **1. PHÁT ÂM**  
- **Phiên âm IPA** (Anh - Mỹ).  
- **Trọng âm & cách đọc chuẩn**.  

🔹 *Ví dụ:*  
**Từ:** **""schedule""**  
- **IPA:** */ˈskedʒ.uːl/* (Mỹ) | */ˈʃed.juːl/* (Anh)  
- **Trọng âm:** **SCHED-ule** (nhấn âm đầu tiên)  

---

## **2. GIẢI NGHĨA**  
- **Nghĩa phổ biến nhất**, kèm **ví dụ thực tế**.  
- **Các nghĩa khác (nếu có)**, sắp xếp từ phổ biến → ít phổ biến hơn.  
- **Nếu có câu ví dụ của người dùng**, ưu tiên giải thích **nghĩa phù hợp nhất**.  

🔹 *Ví dụ:*  
**Từ:** **""bank""**  
- **Nghĩa 1 (danh từ, phổ biến nhất):** Ngân hàng.  
  - *Ví dụ:* *I went to the bank to withdraw money.* → **Tôi đến ngân hàng để rút tiền**.  
- **Nghĩa 2 (danh từ, khác):** Bờ sông, bờ hồ.  
  - *Ví dụ:* *They had a picnic by the river bank.* → **Họ tổ chức dã ngoại bên bờ sông**.  

---

## **3. ỨNG DỤNG VÀO NGỮ PHÁP**  
- **Loại từ**: Danh từ, động từ, tính từ...  
- **Cấu trúc câu phổ biến**.  
- **Lỗi sai thường gặp & cách tránh**.  
- **Từ đồng nghĩa, trái nghĩa**.  

🔹 *Ví dụ:*  
**Từ:** **""recommend""**  
- **Loại từ:** Động từ.  
- **Cấu trúc đúng:**  
  - *✅ I recommend that you read this book.*  
  - *❌ I recommend you to read this book.* (*Sai! Không dùng ""recommend to"")*.  

---

## **4.  CỤM TỪ VÀ THÀNH NGỮ LIÊN QUAN**  
- **Các cụm từ phổ biến có chứa từ đó**.  
- **Giải thích nghĩa & cách sử dụng**.  
- **Nếu cần, cung cấp bảng so sánh với các từ/cụm từ/thành ngữ tương tự (cheat sheet) để giúp người dùng hiểu rõ hơn và ứng dụng tốt hơn**.  

🔹 *Ví dụ:*  
**Từ:** **""piece""**  
- **Thành ngữ:** *""A piece of cake""* → *Rất dễ dàng*.  
  - *Ví dụ:* *""The test was a piece of cake!""* → **Bài kiểm tra này dễ như ăn bánh!**  

🔸 **Cheat sheet:**  

| Từ | Nghĩa | Khác biệt |  
|---|---|---|  
| **piece** | Một mảnh, một phần | Dùng cho vật thể cụ thể (*a piece of paper*) hoặc trừu tượng (*a piece of advice*) |  
| **part** | Phần, bộ phận | Dùng cho tổng thể lớn (*part of the system*) |  
| **portion** | Một phần nhỏ | Dùng trong ẩm thực (*a portion of salad*) hoặc số lượng (*a portion of income*) |  

---

## **5. Từ đồng nghĩa và từ trái nghĩa**  

- **Từ đồng nghĩa (Synonyms):** Liệt kê tối thiểu 5 từ/cụm từ/thành ngữ có ý nghĩa tương đồng hoặc gần giống nhau, sắp xếp từ mức độ phổ biến cao đến thấp.  
- **Từ trái nghĩa (Antonyms):**Liệt kê tối thiểu 5 từ/cụm từ/thành ngữ có ý nghĩa đối lập hoàn toàn hoặc mang sắc thái trái ngược.  
- **Nếu có sự khác biệt về sắc thái nghĩa giữa các từ đồng nghĩa hoặc từ trái nghĩa, hãy lập một bảng cheat sheet để so sánh.**  

🔹 **Ví dụ 1:**  
**Từ:** **""happy""** (*hạnh phúc, vui vẻ*)  
- **Từ đồng nghĩa:** *joyful, cheerful, content, delighted, ecstatic, elated*.  
- **Từ trái nghĩa:** *sad, miserable, unhappy, depressed, sorrowful*.  

📌 **Bảng So Sánh: ""Happy"" và các từ đồng nghĩa**  

| **Từ vựng**   | **Sắc thái ý nghĩa** |
|--------------|------------------|
| **Happy**    | Trạng thái hạnh phúc chung chung. |
| **Joyful**   | Niềm vui rạng rỡ, rõ ràng, thể hiện ra bên ngoài. |
| **Content**  | Hài lòng với cuộc sống, không quá hạnh phúc nhưng đủ để cảm thấy ổn định. |
| **Delighted** | Niềm vui khi nhận được điều gì đó tốt đẹp. |
| **Ecstatic** | Cực kỳ hạnh phúc, phấn khích đến mức không kìm được cảm xúc. |

🔹 **Ví dụ 2:**  
**Từ:** **""strong""** (*mạnh mẽ*)  
- **Từ đồng nghĩa:** *powerful, sturdy, robust, muscular, vigorous*.  
- **Từ trái nghĩa:** *weak, fragile, feeble, frail*.  

📌 **Bảng so sánh ""Strong"" và các từ đồng nghĩa**  

| **Từ vựng**   | **Sắc thái ý nghĩa** |
|--------------|------------------|
| **Strong**   | Mạnh mẽ nói chung, có thể dùng cho thể chất, tinh thần hoặc quan điểm. |
| **Powerful** | Có sức mạnh lớn, thường dùng cho người có quyền lực hoặc máy móc. |
| **Sturdy**   | Vững chắc, khó bị phá vỡ (thường dùng cho vật thể). |
| **Robust**   | Khỏe mạnh, cường tráng (thường dùng cho con người, hệ thống). |
| **Vigorous** | Tràn đầy năng lượng, hoạt động mạnh mẽ. |

## **5. THÔNG TIN THÚ VỊ & MẸO GHI NHỚ**  
- **Nguồn gốc từ vựng**.  
- **Khác biệt giữa các biến thể tiếng Anh**.  
- **Mẹo ghi nhớ dễ thuộc**.  
- **Liên hệ với văn hóa, lịch sử nếu cần**.  

🔹 *Ví dụ:*  
**Từ:** **""salary""**  
- **Nguồn gốc:** Từ *""salarium""* trong tiếng Latin, có nghĩa là **tiền trả cho lính La Mã để mua muối**.  

---

## **6. TỔNG KẾT**  
- **Nghĩa chính & cách dùng phổ biến nhất**.  
- **Cấu trúc câu quan trọng cần nhớ**.  
- **Từ đồng nghĩa, trái nghĩa nổi bật**.  
- **Điểm khác biệt cần chú ý (nếu có)**.  

🔹 *Ví dụ:*  
**Từ:** **""advice""**  
✅ **Danh từ không đếm được**, không dùng *""an advice""*.  
✅ **Cấu trúc đúng:** *""give (someone) advice""*, *""ask for advice""*.  
✅ **Từ đồng nghĩa:** *suggestion, recommendation*.  
✅ **Từ trái nghĩa:** *misguidance*.  

---

#  **NGUYÊN TẮC CHUNG**
✅ **Tự kiểm tra lại tính chính xác và xác thực của thông tin trước khi gửi cho người dùng**.
✅ **Chỉ dùng ngôn ngữ chính thống, tránh ngôn ngữ lóng, từ lóng, không được viết tắt, và không thêm bất kỳ comment hay ý kiến chủ quan**.
✅ **Trình bày kết quả dưới hình thức trang trọng (tương tự như từ điển, văn bản hành chính, bài báo khoa học,...), sử dụng định dạng rõ ràng và dễ đọc**.
✅ **Trình bày nội dung ngắn gọn dễ hiểu, đi thẳng vào trọng tâm của từng phần, không viết lòng vòng, tập trung vào những thông tin quan trọng nhất**.
✅ **Luôn giải thích nghĩa theo ngữ cảnh nếu có**.
✅ **Không dùng từ ngữ quá phức tạp hoặc gây khó hiểu hoặc dễ gây hiểu nhầm, không dùng từ ngữ mang tính chất phân biệt chủng tộc, giới tính, địa lý**.
✅ **Chỉ lập cheat sheet khi có thông tin dễ gây nhầm lẫn**.   
✅ **Ưu tiên giải thích sự khác nhau giữa các từ để giúp người học sử dụng đúng ngữ cảnh**.";
        public static async Task<SearchResult> Search(string apiKey, string keyword, string context)
        {
            var promptBuilder = new StringBuilder();
            var internetSearchResult = await SearchForEnglishInforAsync(keyword);

            promptBuilder.AppendLine("## Từ khóa cần tra cứu:");
            promptBuilder.AppendLine($"- {keyword.Trim()}");

            if (!string.IsNullOrEmpty(context))
            {
                promptBuilder.AppendLine();
                promptBuilder.AppendLine("## Ngữ cảnh chứa từ khóa cần tra cứu:");
                promptBuilder.AppendLine($"- {context.Trim()}");
            }

            if (internetSearchResult != null && !string.IsNullOrEmpty(internetSearchResult.Content))
            {
                promptBuilder.AppendLine();
                promptBuilder.AppendLine("---");
                promptBuilder.AppendLine();
                promptBuilder.AppendLine($"> *Dưới đây là một số thông tin mà tôi tra cứu được trên mạng liên quan đến nghĩa của `{keyword}` để bạn tham khảo.*");
                promptBuilder.AppendLine();
                promptBuilder.AppendLine(internetSearchResult.Content);
            }

            var apiRequest = new ApiRequestBuilder()
                .WithSystemInstruction(_instruction)
                .WithPrompt(promptBuilder.ToString())
                .WithDefaultGenerationConfig(0.3F)
                .DisableAllSafetySettings()
                .Build();

            var generator = new Generator(apiKey);

            var response = await generator.GenerateContentAsync(apiRequest, ModelVersion.Gemini_20_Flash);

            return new SearchResult
            {
                Content = response.Result,
                IpaAudioUrls = internetSearchResult?.IpaAudioUrls,
            };
        }

        private static async Task<SearchResult?> SearchForEnglishInforAsync(string keyword)
        {
            try
            {
                var results = await EngDict.NET.EngDict.SearchAsync(keyword);
                if (results == null || results.Count == 0)
                {
                    return null;
                }

                var stringBuilder = new StringBuilder();
                foreach (var result in results)
                {
                    if (result.Phonetics != null)
                    {
                        var phonetics = result.Phonetics
                            .Where(p => !string.IsNullOrEmpty(p.IpaTranscription))
                            .DistinctBy(p => p.IpaTranscription)
                            .ToList();

                        if (phonetics.Count > 0)
                        {
                            stringBuilder.AppendLine("### **IPA Phonetics**");
                            foreach (var phonetic in phonetics)
                            {
                                if (!string.IsNullOrEmpty(phonetic.AudioUrl))
                                {
                                    stringBuilder.AppendLine($"- [{phonetic.IpaTranscription}]({phonetic.AudioUrl})");
                                }
                                else
                                {
                                    stringBuilder.AppendLine($"- {phonetic.IpaTranscription}");
                                }
                            }
                            stringBuilder.AppendLine();
                        }
                    }

                    foreach (var meaning in result.Meanings)
                    {
                        stringBuilder.AppendLine($"### **Part of Speech: {EnumHelper.GetDescription(meaning.PartOfSpeech)}**");

                        foreach (var definition in meaning.Definitions)
                        {
                            stringBuilder.AppendLine($"- **Definition:** {definition.Description}");
                            if (definition.Synonyms != null)
                            {
                                stringBuilder.AppendLine($"    - **Synonyms:** {string.Join(", ", definition.Synonyms)}");
                            }
                            if (definition.Antonyms != null)
                            {
                                stringBuilder.AppendLine($"    - **Antonyms:** {string.Join(", ", definition.Antonyms)}");
                            }
                            if (!string.IsNullOrEmpty(definition.Example))
                            {
                                stringBuilder.AppendLine($"    - **Example:** {definition.Example}");
                            }
                            stringBuilder.AppendLine();
                        }

                        if (meaning.Synonyms != null)
                        {
                            stringBuilder.AppendLine($"- **Synonyms:** {string.Join(", ", meaning.Synonyms)}");
                        }
                        if (meaning.Antonyms != null)
                        {
                            stringBuilder.AppendLine($"- **Antonyms:** {string.Join(", ", meaning.Antonyms)}");
                        }

                        stringBuilder.AppendLine();
                    }
                }

                return new SearchResult
                {
                    IpaAudioUrls = results
                        .Where(r => r.Phonetics != null
                            && r.Phonetics.Count > 0
                            && r.Phonetics.Any(p => !string.IsNullOrEmpty(p.AudioUrl)))
                        .SelectMany(r => r.Phonetics)
                        .Select(p => p.AudioUrl)
                        .Where(url => !string.IsNullOrEmpty(url))
                        .Distinct()
                        .ToList(),

                    Content = stringBuilder.ToString()
                };
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
