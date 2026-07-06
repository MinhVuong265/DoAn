package com.project.recruitment.dto.response;
import java.util.List;

// Response DTO - Kết quả tìm kiếm công việc
public record JobSearchResponse(
    Long id,
    String title,
    String company,
    String location,
    String jobType,
    Float salaryMin,
    Float salaryMax,
    String description,
    Float matchingScore,
    List<String> matchedSkills
) {}
