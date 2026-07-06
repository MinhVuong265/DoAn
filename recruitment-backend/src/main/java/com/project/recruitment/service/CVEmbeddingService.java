package com.project.recruitment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.recruitment.model.CV;
import com.project.recruitment.model.User;
import com.project.recruitment.model.CvEmbedding;
import com.project.recruitment.repository.CvEmbeddingRepository;
import com.project.recruitment.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.stream.Collectors;
@Service
public class CVEmbeddingService {

    @Autowired
    private ChatbotRagService chatbotRagService;

    @Autowired
    private CVService cvService;

    @Autowired
    private CvEmbeddingRepository cvEmbeddingRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
public void parseAndSaveCVSystem(String cvRawText,
                                 String originalFileName,
                                 Long userId) {

        String prompt = """
                Bạn là hệ thống phân tích CV.

                Hãy đọc CV dưới đây và trả về CHÍNH XÁC JSON.

                Không markdown.
                Không ```json.
                Không giải thích.
                Không thêm thuộc tính.

                {
                "fullName":"",
                "email":"",
                "phone":"",
                "skills":"",
                "experience":"",
                "education":"",
                "summary":""
                }

                Nếu không tìm thấy thì để chuỗi rỗng.

                CV:

                """ + cvRawText;

        String jsonResult = chatbotRagService.generateResponse(prompt);

        System.out.println("=========== GEMINI RESPONSE ===========");
        System.out.println(jsonResult);
        System.out.println("=======================================");

        try {

            String cleanJson = jsonResult
                    .replaceAll("^[^{]*", "")
                    .replaceAll("[^}]*$", "")
                    .trim();

            ObjectMapper mapper = new ObjectMapper();

            JsonNode jsonNode = mapper.readTree(cleanJson);

            String fullName = getValue(jsonNode,
                    "fullName",
                    "full_name",
                    "name",
                    "candidateName");

            String email = getValue(jsonNode,
                    "email",
                    "mail",
                    "gmail");

            String phone = getValue(jsonNode,
                    "phone",
                    "phoneNumber",
                    "mobile");

            String skills = getValue(jsonNode,
                    "skills",
                    "technicalSkills",
                    "skill");

            String experience = getValue(jsonNode,
                    "experience",
                    "workExperience",
                    "experiences");

            String education = getValue(jsonNode,
                    "education",
                    "educationLevel");

            String summary = getValue(jsonNode,
                    "summary",
                    "profile",
                    "objective");

            // =============================
            // Lấy thông tin từ User nếu AI thiếu
            // =============================

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

            if (fullName.isBlank()) {
                fullName = user.getFullName();
            }

            if (email.isBlank()) {
                email = user.getEmail();
            }

            // =============================
            // Lưu CV
            // =============================

            CV savedCV = cvService.createNewCV(
                    originalFileName,
                    fullName,
                    email,
                    phone,
                    skills,
                    experience,
                    education,
                    summary,
                    userId
            );

            // =============================
            // Sinh Embedding
            // =============================

            List<Double> embedding =
                    chatbotRagService
                            .getEmbeddingService()
                            .getEmbedding(cvRawText);

            if (embedding == null || embedding.isEmpty()) {
                throw new RuntimeException("Embedding rỗng.");
            }

            String vector = embedding.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(",", "[", "]"));

            cvEmbeddingRepository.saveOrUpdateVector(
                    savedCV.getId(),
                    cvRawText,
                    vector
            );

        } catch (Exception e) {

            System.err.println("========== JSON PARSE ERROR ==========");
            System.err.println(jsonResult);
            e.printStackTrace();

            throw new RuntimeException("Lỗi khi xử lý CV: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> searchCVsBySemantic(String keyword, int limit) {
        // 1. Gọi Gemini biến câu tìm kiếm thành Vector List<Double>
        List<Double> queryVectorList = chatbotRagService.getEmbeddingService().getEmbedding(keyword);
        
        if (queryVectorList == null || queryVectorList.isEmpty()) {
            return List.of();
        }

        // 2. Ép mảng List thành chuỗi "[0.1, 0.2, 0.3...]"
        String queryVectorStr = queryVectorList.toString();

        // 3. Định nghĩa ngưỡng tương đồng (Dùng cho hàm match_cvs thường từ 0.2 đến 0.5 tùy cấu hình hàm)
        double threshold = 0.3; 

        // 4. Gọi hàm searchSemantic SẴN CÓ của em
        return cvEmbeddingRepository.searchSemantic(queryVectorStr, threshold, limit);
    }

    private String getValue(JsonNode node, String... keys) {

        for (String key : keys) {
            if (node.has(key) && !node.get(key).isNull()) {

                String value = node.get(key).asText().trim();

                if (!value.isBlank()) {
                    return value;
                }
            }
        }

        return "";
    }
}