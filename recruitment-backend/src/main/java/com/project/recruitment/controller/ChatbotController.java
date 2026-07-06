package com.project.recruitment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.recruitment.dto.request.ChatRequest;
import com.project.recruitment.dto.response.ChatResponse;
import com.project.recruitment.service.ChatbotRagService;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
@RestController
@RequestMapping("/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotRagService chatbotRagService;

    // API nhận Request DTO và trả về Response DTO sạch sẽ
    @PostMapping("/ask")
    public ResponseEntity<?> askChatbot(@RequestBody ChatRequest chatRequest) {
        if (chatRequest.getMessage() == null || chatRequest.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nội dung tin nhắn không được để trống!"));
        }
        if (chatRequest.getMessage().length() > 4000) {
                return ResponseEntity.badRequest().body(Map.of("reply", "Câu hỏi của bạn quá dài! Vui lòng tóm tắt lại dưới 4000 ký tự."));
        }
        try {
            // Xử lý logic và nhận về DTO đầu ra
            String response = chatbotRagService.generateResponse(chatRequest.getMessage());
            return ResponseEntity.ok(Map.of("reply", response));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi xử lý hệ thống Chatbot: " + e.getMessage()));
        }
    }
    @PostMapping("/upload") // Đổi endpoint cho khớp chính xác với gọi lệnh từ axios ở FE
    public ResponseEntity<?> uploadCvForAi(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File tải lên không được trống!"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Hệ thống hiện tại ưu tiên phân tích cấu trúc file định dạng .PDF"));
        }

        try (InputStream is = file.getInputStream();
             PDDocument document = PDDocument.load(is)) {

            // 1. Trích xuất văn bản thô từ PDF
            PDFTextStripper pdfStripper = new PDFTextStripper();
            String extractedText = pdfStripper.getText(document);

            if (extractedText == null || extractedText.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Không thể đọc được nội dung văn bản từ file PDF này."));
            }

            // Làm sạch văn bản thô
            String cleanText = extractedText.replaceAll("\\r?\\n", " ").replaceAll("'", "''").trim();
            if (cleanText.length() > 6000) {
                cleanText = cleanText.substring(0, 6000);
            }

            // 2. GỌI GEMINI AI ĐỂ BÓC TÁCH NỘI DUNG (NER - Named Entity Recognition)
            // Khởi tạo Prompt ép Gemini trả về định dạng JSON chuỗi cố định
            String aiPrompt = "Bạn là một chuyên gia tuyển dụng AI thông minh. Hãy đọc đoạn văn bản CV sau và trích xuất thông tin theo cấu trúc JSON chuẩn "
                    + "để cấu hình cho Front-end. Định dạng JSON bắt buộc phải có các khóa sau: "
                    + "fullName (chuỗi), email (chuỗi), phone (chuỗi), skills (mảng chuỗi), experience (chuỗi mô tả ngắn gọn kinh nghiệm), education (chuỗi trường học vấn). "
                    + "Chỉ trả về chuỗi dữ liệu dạng JSON thuần túy, không viết thêm bất kỳ chữ nào khác ngoài JSON. Đoạn văn bản CV: " + cleanText;

            // Gọi qua chat service hiện tại của em (Giả định hàm sinh văn bản của em tên là generateResponse hoặc chat)
            String aiJsonResult = chatbotRagService.generateResponse(aiPrompt); 
            
            // Làm sạch chuỗi JSON nếu mô hình trả về block mã ```json ... ```
            if (aiJsonResult.contains("```json")) {
                aiJsonResult = aiJsonResult.substring(aiJsonResult.indexOf("```json") + 7, aiJsonResult.lastIndexOf("```"));
            } else if (aiJsonResult.contains("```")) {
                aiJsonResult = aiJsonResult.substring(aiJsonResult.indexOf("```") + 3, aiJsonResult.lastIndexOf("```"));
            }

            // Đọc chuỗi JSON chuyển đổi thành Map Object trong Java
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> parsedData = objectMapper.readValue(aiJsonResult.trim(), Map.class);

            // 3. ĐỒNG THỜI SINH VECTOR EMBEDDING (Để lưu trữ phục vụ Matching sau này)
            try {
                List<Double> embeddingVector = chatbotRagService.getEmbeddingService().getEmbedding(cleanText);
                String vectorString = embeddingVector.toString();
                
                // Vì không cần cvId truyền lên, em có thể tạm lưu với ID User hoặc xử lý lưu đè vào Profile ở bước sau.
                // chatbotRagService.getCvEmbeddingRepository().saveVector(userId, cleanText, vectorString);
            } catch (Exception ex) {
                System.err.println("Bỏ qua hoặc ghi log lỗi Vector: " + ex.getMessage());
            }

            // 4. TRẢ VỀ CHO FE ĐÚNG CẤU TRÚC MÀ COMPONENT CVUploader.jsx MONG ĐỢI
            return ResponseEntity.ok(Map.of(
                "success", true,
                "parsedData", parsedData // Chứa đầy đủ fullName, email, phone, skills, experience, education
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi xử lý trích xuất số hóa CV: " + e.getMessage()));
        }
    }
}