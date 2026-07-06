package com.project.recruitment.repository;

import com.project.recruitment.model.JobPost;
import com.project.recruitment.model.JobEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;
import jakarta.transaction.Transactional;   
@Repository
public interface JobEmbeddingRepository extends JpaRepository<JobEmbedding, Long> {

    // Gọi hàm RPC match_jobs từ PostgreSQL/Supabase để lấy việc làm phù hợp
    @Query(value = "SELECT job_id, content, similarity FROM match_jobs(cast(:queryEmbedding as vector), :threshold, :maxRows)", nativeQuery = true)
    List<Map<String, Object>> searchSemanticJobs(
        @Param("queryEmbedding") String queryEmbeddingString, 
        @Param("threshold") double threshold, 
        @Param("maxRows") int maxRows
    );

    @Modifying
    @Transactional
    @Query(value = """
    INSERT INTO job_embeddings
    (job_id,content,embedding)
    VALUES
    (
    :jobId,
    :content,
    CAST(:embedding AS vector)
    )
    """, nativeQuery = true)
    void saveVector(
            @Param("jobId") Long jobId,
            @Param("content") String content,
            @Param("embedding") String embedding);

    @Query(value = """
    SELECT
        j.id,
        j.title,
        CAST(je.embedding AS text) AS embedding
    FROM job_posts j
    JOIN job_embeddings je
    ON j.id = je.job_id
    WHERE j.id = :jobId
    """, nativeQuery = true)
    Map<String,Object> findJobEmbedding(@Param("jobId") Long jobId);                
}

