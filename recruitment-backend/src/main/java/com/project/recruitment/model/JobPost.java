package com.project.recruitment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_posts")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobPost {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer; // Nhà tuyển dụng


    @Column(nullable = false)
    private String title; // Tiêu đề công việc
    
    @Column(columnDefinition = "TEXT")
    private String description; // Mô tả công việc
    
    @Column(columnDefinition = "TEXT")
    private String requirements; // Yêu cầu công việc
    
    @Column(columnDefinition = "TEXT")
    private String benefits; // Quyền lợi ứng viên
    
    @Column(name = "skills_tags", columnDefinition = "TEXT")
    private String skillsTags; // Các kỹ năng yêu cầu (ngăn cách bằng dấu phẩy)
    
    @Column(name = "company_name")
    private String companyName; // Tên công ty
    
    @Column(name = "salary_min")
    private Float salaryMin;
    
    @Column(name = "salary_max")
    private Float salaryMax;
    
    private String location; // Địa điểm làm việc
    
    @Column(name = "job_type", length = 50) 
    private String jobType; // FULL_TIME, PART_TIME, CONTRACT, REMOTE
    
    @Column(name = "years_experience_required")
    private Integer yearsExperienceRequired;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private JobStatus status = JobStatus.ACTIVE;
    
    // --- CẤU HÌNH PHỤC VỤ AI SEMANTIC SEARCH / RAG ---
    
    // Lưu trữ chuỗi text thô tổng hợp (Title + Description + Requirements) làm ngữ cảnh
    @Column(name = "content_embedding", columnDefinition = "TEXT")
    private String contentEmbedding;
    
    // --- QUẢN LÝ THỜI GIAN ---
    
    @Column(name = "posted_date")
    private LocalDateTime postedDate;
    
    @Column(name = "closed_date")
    private LocalDateTime closedDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        this.postedDate = now;
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}