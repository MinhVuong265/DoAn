package com.project.recruitment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String response;             // Câu trả lời bằng định dạng Markdown của AI
    private LocalDateTime timestamp;     // Thời gian phản hồi hệ thống
    private List<String> sourcesSources; // (Tùy chọn) Danh sách tiêu đề tài liệu/JD mà AI đã tham chiếu để trả lời
}