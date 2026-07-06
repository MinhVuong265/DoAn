package com.project.recruitment.dto.request;

import lombok.Data;

@Data
public class JobPostRequest {
    private Long employerId; // ID nhà tuyển dụng đang đăng bài
    private String title;
    private String companyName;
    private String location;
    private String salaryRange;
    private String description;
    private String skillsTags; // Chuỗi kỹ năng viết cách nhau bằng dấu phẩy
}