package com.project.recruitment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.recruitment.repository.CvEmbeddingRepository;
import com.project.recruitment.repository.JobPostRepository;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.AbstractMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatbotRagService {

    @Value("${gemini.api-key}")
    private String apiKey;

    private final EmbeddingService embeddingService;
    private final CvEmbeddingRepository cvEmbeddingRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final JobPostRepository jobPostRepository;
    @Autowired
    public ChatbotRagService(EmbeddingService embeddingService, 
                             CvEmbeddingRepository cvEmbeddingRepository,
                             JobPostRepository jobPostRepository) {
        this.embeddingService = embeddingService;
        this.cvEmbeddingRepository = cvEmbeddingRepository;
        this.jobPostRepository = jobPostRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // =========================================================================
    // PHƯƠNG THỨC BỔ SUNG ĐỂ PHỤC VỤ CHO CVParsingService
    // =========================================================================
    /**
     * Lấy mảng Vector Embedding từ văn bản thô phục vụ lưu trữ số hóa CV vào database
     */
    public List<Double> getEmbedding(String text) {
        try {
            // Gọi qua embeddingService sẵn có để lấy danh sách tọa độ vector (List<Double>)
            List<Double> vectorList = embeddingService.getEmbedding(text);
            
            // Chuyển đổi List<Double> sang float[] để khớp với yêu cầu lưu trữ của Entity
            float[] floatVector = new float[vectorList.size()];
            for (int i = 0; i < vectorList.size(); i++) {
                floatVector[i] = vectorList.get(i).floatValue();
            }
            return embeddingService.getEmbedding(text);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi trích xuất Vector Embedding từ AI: " + e.getMessage(), e);
        }
    }

    // =========================================================================
    // 2 HÀM GETTER ĐỂ CHATBOTCONTROLLER CÓ THỂ GỌI ĐƯỢC
    // =========================================================================
    public EmbeddingService getEmbeddingService() {
        return this.embeddingService;
    }

    public CvEmbeddingRepository getCvEmbeddingRepository() {
        return this.cvEmbeddingRepository;
    }

    /**
     * Hàm xử lý luồng RAG: Số hóa câu hỏi -> Tìm kiếm ngữ nghĩa trong DB -> Tạo Prompt kèm ngữ cảnh -> Gọi Gemini
     */
    // public String generateResponse(String userPrompt) {
    //     try {
    //         // 1. Lấy tọa độ Vector của câu hỏi từ người dùng
    //         List<Double> queryVector = embeddingService.getEmbedding(userPrompt);
    //         String vectorString = queryVector.toString(); 

    //         // 2. Tìm kiếm ngữ nghĩa trong Supabase để lấy ra các tài liệu CV liên quan nhất
    //         List<Map<String, Object>> matchedCvs = cvEmbeddingRepository.searchSemantic(vectorString, 0.4, 3);
    //         // 3. Gộp các nội dung CV tìm được thành một đoạn ngữ cảnh (Context)
    //         String context = "";
    //         if (matchedCvs != null && !matchedCvs.isEmpty()) {
    //             context = matchedCvs.stream()
    //                     .map(m -> m.get("content").toString())
    //                     .collect(Collectors.joining("\n---\n"));
    //         }

    //         // 4. Thiết kế Hệ thống Nhắc (System Prompt) ép Gemini phải làm bài dựa trên tài liệu CV tìm được
    //         String finalPrompt = "Bạn là một trợ lý Tuyển dụng AI thông minh.\n"
    //                 + "Dưới đây là dữ liệu các CV ứng viên tìm được trong hệ thống phù hợp với câu hỏi:\n"
    //                 + "====== NGỮ CẢNH CV ======\n" + (context.isEmpty() ? "Không tìm thấy CV nào phù hợp trong cơ sở dữ liệu." : context) + "\n========================\n\n"
    //                 + "Dựa vào ngữ cảnh trên, hãy trả lời câu hỏi sau của người dùng một cách khách quan chuyên nghiệp. "
    //                 + "Nếu ngữ cảnh không có thông tin hoặc không tìm thấy ứng viên, hãy trả lời dựa trên kiến thức tuyển dụng chung của bạn nhưng có nhắc nhở rõ ràng cho nhà tuyển dụng là hệ thống chưa ghi nhận ứng viên trực tiếp phù hợp.\n"
    //                 + "Câu hỏi: " + userPrompt;

    //         // 5. Gửi Prompt đã có ngữ cảnh CV sang cho Gemini v1 ổn định xử lý
    //         String url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    //         Map<String, Object> requestBody = new HashMap<>();
    //         Map<String, Object> parts = new HashMap<>();
    //         parts.put("text", finalPrompt);
    //         Map<String, Object> content = new HashMap<>();
    //         content.put("parts", List.of(parts));
    //         requestBody.put("contents", List.of(content));

    //         Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);

    //         // Bóc tách JSON kết quả an toàn
    //         if (response != null && response.containsKey("candidates")) {
    //             List<?> candidates = (List<?>) response.get("candidates");
    //             if (!candidates.isEmpty()) {
    //                 Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
    //                 Map<?, ?> contentRes = (Map<?, ?>) firstCandidate.get("content");
    //                 List<?> partsRes = (List<?>) contentRes.get("parts");
    //                 Map<?, ?> firstPart = (Map<?, ?>) partsRes.get(0);
    //                 return firstPart.get("text").toString();
    //             }
    //         }
    //         return "Không thể bóc tách câu trả lời từ máy chủ AI.";

    //     } catch (Exception e) {
    //         return "Lỗi xử lý luồng RAG hệ thống: " + e.getMessage();
    //     }
    // }
    private static class UserIntent {
        public String intent;
        public String cleanQuery;
    }
    public String generateResponse(String userPrompt) {
        try {
            // ==========================
            // BƯỚC 1: Phân loại ý định
            // ==========================
            // String intentPrompt = """
            //     Bạn là API phân loại ý định.
            //     Hãy phân tích câu của người dùng.
            //     CHỈ trả về JSON.
            //     Không giải thích.
            //     Không markdown.
            //     Không dùng ```json.
            //     Chỉ có đúng định dạng:
            //     {
            //     "intent":"JOB",
            //     "cleanQuery":"java spring boot"
            //     }
            //     intent chỉ được phép là:
            //     - JOB
            //     - CV
            //     - CHAT
            //     Câu cần phân tích:
            //     %s
            //     """.formatted(userPrompt);
            // // Gọi Gemini chỉ 1 lần
            // String json = callGeminiApi(intentPrompt);
            // // Làm sạch kết quả
            // json = json.replace("```json", "")
            //         .replace("```", "")
            //         .trim();
            // int start = json.indexOf("{");
            // int end = json.lastIndexOf("}");
            // if (start != -1 && end != -1) {
            //     json = json.substring(start, end + 1);
            // }
            // System.out.println("Intent JSON: " + json);
            // UserIntent userIntent = objectMapper.readValue(json, UserIntent.class);
            UserIntent userIntent = classifyIntent(userPrompt);
            // ==========================
            // BƯỚC 2: Sinh Embedding
            // ==========================
            double[] queryVector = embeddingService
                    .getEmbedding(userIntent.cleanQuery)
                    .stream()
                    .mapToDouble(Double::doubleValue)
                    .toArray();
            String context = "";
            String systemInstruction = "";
            // ==========================
            // BƯỚC 3: Semantic Search
            // ==========================
            if ("JOB".equalsIgnoreCase(userIntent.intent)) {
                List<Map<String, Object>> allJobs = jobPostRepository.findAllEmbeddings();
                context = getTopMatches(allJobs, queryVector, 3);
                systemInstruction = """
                        Bạn là trợ lý tuyển dụng.
                        Hãy trả lời bằng Markdown.
                        Quy tắc:
                        - Dùng tiêu đề ## khi giới thiệu kết quả.
                        - Mỗi công việc là một card gồm:
                        - ### Tên vị trí
                        - 🏢 Công ty
                        - 📍 Địa điểm
                        - 💰 Lương (nếu có)
                        - 🛠 Kỹ năng
                        - 📄 Mô tả ngắn
                        - ✅ Yêu cầu
                        - Dùng bullet list.
                        - Không viết thành một đoạn văn dài.
                        - Cuối cùng hỏi người dùng muốn xem vị trí nào.
                        - Không bịa thông tin ngoài dữ liệu.
                        Dữ liệu:
                        """ + context;
            } else if ("CV".equalsIgnoreCase(userIntent.intent)) {
                List<Map<String, Object>> allCvs = cvEmbeddingRepository.findAllEmbeddings();
                context = getTopMatches(allCvs, queryVector, 3);
                systemInstruction = """
                        Bạn là chuyên gia tuyển dụng.
                        Hãy trả lời bằng Markdown.
                        Quy tắc:
                        - Dùng tiêu đề ## khi giới thiệu kết quả.
                        - Mỗi ứng viên là một card gồm:
                        - ### Tên ứng viên
                        - 🏢 Công ty
                        - 📍 Địa điểm
                        - 💰 Mức lương (nếu có)
                        - 🛠 Kỹ năng
                        - 📄 Mô tả ngắn
                        - ✅ Yêu cầu
                        - Dùng bullet list.
                        - Không viết thành một đoạn văn dài.
                        - Cuối cùng hỏi người dùng muốn xem ứng viên nào.
                        - Không bịa thông tin ngoài dữ liệu.
                        Dữ liệu:
                        """ + context;
            } else {
                systemInstruction = """
                        Bạn là chuyên gia hướng nghiệp.
                        Trả lời ngắn gọn, tự nhiên và hữu ích.
                        """;
            }
            // ==========================
            // BƯỚC 4: Sinh câu trả lời
            // ==========================
            return callGeminiApi(systemInstruction +
                    "\n\nCâu hỏi người dùng: " + userPrompt);
        } catch (Exception e) {
            e.printStackTrace();
            return "Hệ thống đang xử lý, vui lòng thử lại. (Chi tiết: " + e.getMessage() + ")";
        }
    }


    private String getTopMatches(List<Map<String, Object>> items, double[] queryVector, int limit) {
        return items.stream()
            .map(item -> {
                Object embeddingObj = item.get("embedding");
                String embedding;
                if (embeddingObj instanceof org.postgresql.util.PGobject) {
                    embedding = ((org.postgresql.util.PGobject) embeddingObj).getValue();
                } else {
                    embedding = embeddingObj.toString();
                }
                double similarity = calculateCosineSimilarity(
                        queryVector,
                        parseVector(embedding)
                );
                return new AbstractMap.SimpleEntry<>(item, similarity);
            })
            .filter(e -> e.getValue() >= 0.2)
            .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
            .limit(limit)
            .map(e -> String.format(
                    "- %s (Độ khớp %.1f%%)",
                    e.getKey().get("content"),
                    e.getValue() * 100
            ))
            .collect(Collectors.joining("\n"));
    }

    private String callGeminiApi(String promptText) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> parts = new HashMap<>();
            parts.put("text", promptText);
            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(parts));
            requestBody.put("contents", List.of(content));

            Map<?, ?> response = restTemplate.postForObject(url, requestBody, Map.class);

            if (response != null && response.containsKey("candidates")) {
                List<?> candidates = (List<?>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
                    Map<?, ?> contentRes = (Map<?, ?>) firstCandidate.get("content");
                    List<?> partsRes = (List<?>) contentRes.get("parts");
                    Map<?, ?> firstPart = (Map<?, ?>) partsRes.get(0);
                    
                    // Trả về văn bản kết quả đã bóc tách và loại bỏ khoảng trắng thừa
                    return firstPart.get("text").toString().trim();
                }
            }
            return "Không nhận được phản hồi từ mô hình trí tuệ nhân tạo.";
        } catch (Exception e) {
            return "Lỗi kết nối API Gateway: " + e.getMessage();
        }
    }
    private UserIntent classifyIntent(String query) {
        String text = query.toLowerCase();
        UserIntent intent = new UserIntent();
        // Tìm ứng viên / CV
        if (text.contains("cv")
                || text.contains("ứng viên")
                || text.contains("hồ sơ")
                || text.contains("candidate")) {
            intent.intent = "CV";
            intent.cleanQuery = query;
            return intent;
        }
        // Tìm việc
        if (text.contains("việc")
                || text.contains("tuyển")
                || text.contains("job")
                || text.contains("java")
                || text.contains("react")
                || text.contains("spring")
                || text.contains("backend")
                || text.contains("frontend")
                || text.contains("fullstack")
                || text.contains("python")
                || text.contains("php")
                || text.contains("node")
                || text.contains("android")
                || text.contains("ios")) {
            intent.intent = "JOB";
            intent.cleanQuery = query;
            return intent;
        }
        // Còn lại
        intent.intent = "CHAT";
        intent.cleanQuery = query;
        return intent;
    }
    public double calculateCosineSimilarity(double[] vectorA, double[] vectorB) {
        if (vectorA == null || vectorB == null || vectorA.length != vectorB.length || vectorA.length == 0) return 0.0;
    
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }
        
        // Nếu norm bằng 0 thì không thể chia
        if (normA == 0 || normB == 0) return 0.0;
        
        // Công thức Cosine Similarity: DotProduct / (NormA * NormB)
        double similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
        
        // Log kiểm tra để xem score thực tế sau khi tính toán
        System.out.println("Debug - Dot: " + dotProduct + " | NormA: " + Math.sqrt(normA) + " | NormB: " + Math.sqrt(normB));
        
        return similarity;
    }

public double[] parseVector(String vectorStr) {
    try {
        if (vectorStr == null || vectorStr.isEmpty()) return new double[0];
        
        // Loại bỏ ngoặc vuông và tách bằng dấu phẩy
        String[] items = vectorStr.replaceAll("[\\[\\]\\s]", "").split(",");
        double[] results = new double[items.length];
        
        for (int i = 0; i < items.length; i++) {
            results[i] = Double.parseDouble(items[i]);
        }
        
        // LOG KIỂM TRA ĐỘ CHÍNH XÁC
        System.out.println("Debug - Vector sample: " + results[0] + ", " + results[1] + "...");
        return results;
    } catch (Exception e) {
        System.out.println("Debug - Parse Error: " + e.getMessage());
        return new double[0]; 
    }
}

}