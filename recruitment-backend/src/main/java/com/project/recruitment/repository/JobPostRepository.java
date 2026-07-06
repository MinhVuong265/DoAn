package com.project.recruitment.repository;

import com.project.recruitment.model.JobPost;
import com.project.recruitment.model.JobStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Long> {

    // 1. Tìm kiếm theo trạng thái
    List<JobPost> findByStatus(JobStatus status);
    
    /**
     * 2. Tìm kiếm theo ID nhà tuyển dụng mà không cần thay đổi Entity JobPost.
     * Sử dụng @Query để trực tiếp truy cập vào thuộc tính 'id' bên trong đối tượng 'employer'.
     * Cách này an toàn và không gây lỗi cấu trúc.
     */
    @Query("SELECT j FROM JobPost j WHERE j.employer.id = :employerId ORDER BY j.createdAt DESC")
    List<JobPost> findByEmployerIdOrderByCreatedAtDesc(@Param("employerId") Long employerId);

    /**
     * PHƯƠNG THỨC 1: TÌM KIẾM NGỮ NGHĨA SEMANTIC
     */
    @Query(value = "SELECT j.id, j.title, j.company_name as company_name, je.content as content, r.similarity " +
                   "FROM search_job_semantic(cast(:queryEmbedding as vector), :matchThreshold, :matchLimit) r " +
                   "JOIN job_embeddings je ON r.id = je.id " +
                   "JOIN job_posts j ON je.job_id = j.id", 
           nativeQuery = true)
    List<Map<String, Object>> searchSemantic(
        @Param("queryEmbedding") String queryEmbedding,
        @Param("matchThreshold") double matchThreshold,
        @Param("matchLimit") int matchLimit
    );

    @Modifying
    @Query(value = "INSERT INTO job_embeddings (job_id, content, embedding) VALUES (:jobId, :content, cast(:embedding as vector))", nativeQuery = true)
    void saveVector(@Param("jobId") Long jobId, 
                    @Param("content") String content, 
                    @Param("embedding") String embeddingString);

                    
    /**
     * PHƯƠNG THỨC 2: TẤT CẢ EMBEDDINGS PHỤC VỤ TÍNH TOÁN TRÊN JVM
     */
    @Query(value = """
    SELECT
        j.id,
        j.title,
        j.company_name,
        je.content,
        CAST(je.embedding AS text) AS embedding
    FROM job_posts j
    JOIN job_embeddings je ON j.id = je.job_id
    """, nativeQuery = true)
    List<Map<String, Object>> findAllEmbeddings();

    /**
     * PHƯƠNG THỨC 3: TÌM KIẾM DỰ PHÒNG BACKUP (ILIKE)
     */
    @Query(value = "SELECT j.id, j.title, j.company_name as company_name, je.content as content " +
                   "FROM job_embeddings je " +
                   "JOIN job_posts j ON je.job_id = j.id " +
                   "WHERE je.content ILIKE CONCAT('%', :keyword, '%') " +
                   "LIMIT :limit", 
           nativeQuery = true)
    List<Map<String, Object>> searchBackup(
        @Param("keyword") String keyword, 
        @Param("limit") int limit
    );
}
