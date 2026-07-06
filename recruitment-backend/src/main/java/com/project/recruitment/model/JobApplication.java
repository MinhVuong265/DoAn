package com.project.recruitment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "user_id", nullable = false)
    private Long userId; // ID của Ứng viên ứng tuyển

    @Column(name = "cv_url")
    private String cvUrl; // Lưu lại bản CV lúc ứng tuyển

    @Column(name = "matching_score")
    private Float matchingScore; // % Điểm tương thích do AI chấm tự động

    @Column(length = 30)
    private String status = "PENDING"; // PENDING, REVIEWING, ACCEPTED, REJECTED

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    @PrePersist
    protected void onCreate() {
        this.appliedAt = LocalDateTime.now();
    }
}