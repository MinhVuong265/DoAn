package com.project.recruitment.dto.response;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
// Response DTO - Kết quả parse CV

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CVParseResponse {
    private String fullName;
    private String email;
    private String phone;
    private List<String> skills;
    private String experienceSummary;
}