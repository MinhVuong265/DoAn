package com.project.recruitment.dto.response;

public class ApiResponse {
    private boolean success;
    private String message;

    // Hàm khởi tạo bắt buộc phải có
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Các hàm Getter/Setter thủ công để tránh lỗi Lombok
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}