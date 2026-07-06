package com.project.recruitment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId; // Liên kết với bảng Users tài khoản

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String email;
    
    @Column(name = "phone_number")
    private String phoneNumber;

    private String avatarUrl;
    
    private String githubUrl;
    
    private String linkedinUrl;

    @Column(columnDefinition = "TEXT")
    private String summary; // Giới thiệu ngắn bản thân

    @Column(columnDefinition = "TEXT")
    private String experience; // Chi tiết kinh nghiệm làm việc

    @Column(columnDefinition = "TEXT")
    private String education; // Chi tiết học vấn

    @Column(name = "skills_tags")
    private String skillsTags; // Các từ khóa kỹ năng dạng "Java, Spring Boot, SQL"

    @Column(name = "cv_url")
    private String cvUrl; // Đường dẫn file CV đã tải lên hệ thống (nếu có)

    // TRƯỜNG DÀNH CHO AI (Tương tự JobPost)
    @Column(name = "profile_summary_raw", columnDefinition = "TEXT")
    private String profileSummaryRaw; // Văn bản tổng hợp để AI đọc

    @Column(columnDefinition = "TEXT") 
    private String embedding; // Lưu chuỗi định dạng "[0.02, -0.15, ...]" sang vector DB

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}