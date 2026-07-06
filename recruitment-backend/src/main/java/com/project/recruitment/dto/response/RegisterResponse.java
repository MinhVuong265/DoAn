package com.project.recruitment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RegisterResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private String message; // Câu thông báo ví dụ: "Đăng ký tài khoản thành công!"
}