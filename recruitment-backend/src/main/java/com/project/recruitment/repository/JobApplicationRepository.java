package com.project.recruitment.repository;

import com.project.recruitment.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    
    // Kiểm tra xem ứng viên đã ứng tuyển tin này chưa
    boolean existsByJobIdAndUserId(Long jobId, Long userId);

    // Danh sách ứng viên của một Job
    @Query(value = """
    SELECT
        ja.id AS application_id,
        ja.status,
        ja.matching_score,
        ja.applied_at,

        c.id AS cv_id,
        c.full_name,
        c.email,
        c.skills

    FROM job_applications ja

    JOIN cvs c
    ON ja.user_id = c.user_id

    WHERE ja.job_id = :jobId

    ORDER BY
        ja.matching_score DESC,
        ja.applied_at ASC
    """, nativeQuery = true)
    List<Map<String,Object>> findApplicantsByJobId(
            @Param("jobId") Long jobId);

    // Lấy danh sách hồ sơ ứng tuyển của một Job cụ thể (Dành cho Nhà tuyển dụng xem kèm thông tin Profile)
    // @Query(value = "SELECT ja.id as application_id, ja.status, ja.matching_score, ja.applied_at, " +
    //                "cp.full_name, cp.email, cp.skills_tags, cp.summary " +
    //                "FROM job_applications ja " +
    //                "JOIN candidate_profiles cp ON ja.user_id = cp.user_id " +
    //                "WHERE ja.job_id = :jobId ORDER BY ja.matching_score DESC", nativeQuery = true)
    // List<Map<String, Object>> findApplicantsByJobId(@Param("jobId") Long jobId);

    // Thuật toán AI: Tính toán độ tương đồng giữa Vector Job và Vector Profile của Ứng viên
    @Query(value="""
    SELECT
    1-(je.embedding <=> ce.embedding)
    FROM job_embeddings je
    JOIN cvs c
    ON c.user_id=:userId
    JOIN cv_embeddings ce
    ON ce.cv_id=c.id
    WHERE je.job_id=:jobId
    """,nativeQuery=true)
    Double calculateSimilarity(
            @Param("jobId") Long jobId,
            @Param("userId") Long userId
    );
}