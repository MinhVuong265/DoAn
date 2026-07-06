package com.project.recruitment.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobPostResponse {
    private Long id;
    private String title;
    private String companyName;
    private String location;
    private String salaryRange;
    private String description;
    private String skillsTags;
    private LocalDateTime createdAt;
}