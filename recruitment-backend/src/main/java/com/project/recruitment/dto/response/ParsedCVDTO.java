package com.project.recruitment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO cho CV đã được phân tích
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ParsedCVDTO {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String summary;
    private List<String> skills;
    private List<ExperienceDTO> experiences;
    private List<EducationDTO> educations;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ExperienceDTO {
        private String jobTitle;
        private String company;
        private String startDate;
        private String endDate;
        private String description;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class EducationDTO {
        private String degree;
        private String school;
        private String graduationDate;
    }
}
