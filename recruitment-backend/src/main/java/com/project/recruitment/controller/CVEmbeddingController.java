package com.project.recruitment.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import com.project.recruitment.model.CV;
import com.project.recruitment.service.CVEmbeddingService;
import com.project.recruitment.service.CVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
@RestController
@RequestMapping("/cv")
// @CrossOrigin(origins = "*")
public class CVEmbeddingController {

    private final CVEmbeddingService CVEmbeddingService;
    @Autowired
    private CVEmbeddingService cvEmbeddingService;

    @Autowired
    private CVService cvService;




    CVEmbeddingController(CVEmbeddingService CVEmbeddingService) {
        this.CVEmbeddingService = CVEmbeddingService;
    }


    @PostMapping("/parse")
    public ResponseEntity<?> parseCV(@RequestParam("file") MultipartFile file, @RequestParam Long userId) {
        try {
            // 1. Kiểm tra xem file upload lên có trống hay không
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng chọn một file CV hợp lệ để upload.");
            }

            // 2. Chuyển file thành text thô (Dữ liệu byte văn bản)
            // String cvRawText = new String(file.getBytes(), "UTF-8"); // Đảm bảo đọc đúng font tiếng Việt UTF-8
            PDDocument document = PDDocument.load(file.getInputStream());

            PDFTextStripper stripper = new PDFTextStripper();

            String cvRawText = stripper.getText(document);

            document.close();
            System.out.println(cvRawText);
            // 3. Gọi Service xử lý trọn gói: Gửi Gemini trích xuất JSON -> Lưu bảng `cvs` -> Lưu bảng `cv_embeddings`
            String originalFileName = file.getOriginalFilename();
            CVEmbeddingService.parseAndSaveCVSystem(cvRawText, originalFileName, userId);

            // 4. Trả về cấu trúc JSON thông báo thành công cho phía Frontend dễ xử lý
            Map<String, String> response = new HashMap<>();
            response.put("message", "Upload, trích xuất và lưu số hóa dữ liệu CV thành công!");
            response.put("fileName", originalFileName);

            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            // Nếu có lỗi (như lỗi kết nối DB, lỗi API Gemini), trả về mã lỗi 400 hoặc 500 kèm thông báo
            return ResponseEntity.internalServerError().body("Lỗi xử lý hệ thống khi upload file CV: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> semanticSearch(
            @RequestParam("keyword") String keyword,
            @RequestParam(value = "limit", defaultValue = "5") int limit) {
            
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Từ khóa tìm kiếm không được để trống");
        }
        
        List<Map<String, Object>> results = CVEmbeddingService.searchCVsBySemantic(keyword, limit);
        return ResponseEntity.ok(results);
    }

}