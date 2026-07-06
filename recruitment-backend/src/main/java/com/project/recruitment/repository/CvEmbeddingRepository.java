package com.project.recruitment.repository;

import com.project.recruitment.model.CvEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Repository
public interface CvEmbeddingRepository extends JpaRepository<CvEmbedding, Long> {

    // 1. Hàm lưu Vector mới vào Supabase bằng SQL thuần (vì cấu hình JPA gốc không hiểu kiểu VECTOR)
   @Modifying
    @Transactional
    @Query(value = """
    INSERT INTO cv_embeddings (cv_id, content, embedding)
    VALUES (:cvId, :content, CAST(:embedding AS vector))
    ON CONFLICT (cv_id)
    DO UPDATE SET
        content = EXCLUDED.content,
        embedding = EXCLUDED.embedding
    """, nativeQuery = true)
    void saveOrUpdateVector(
            @Param("cvId") Long cvId,
            @Param("content") String content,
            @Param("embedding") String embedding
    );

    // 2. Hàm gọi Function match_cvs để tìm kiếm các CV có ngữ nghĩa giống với câu hỏi nhất
    @Query(value = "SELECT cv_id, content, similarity FROM match_cvs(cast(:queryEmbedding as vector), :threshold, :maxRows)", nativeQuery = true)
    List<Map<String, Object>> searchSemantic(@Param("queryEmbedding") String queryEmbeddingString, 
                                            @Param("threshold") double threshold, 
                                            @Param("maxRows") int maxRows);

                                            
    // @Query(value = "SELECT cv_id, content, embedding FROM cv_embeddings", nativeQuery = true)
    // List<Map<String, Object>> findAllEmbeddings();

    @Query(value = """
    SELECT
        cv_id,
        content,
        CAST(embedding AS text) AS embedding
    FROM cv_embeddings
    """, nativeQuery = true)
    List<Map<String,Object>> findAllEmbeddings();
    // @Query(value = "SELECT * FROM cv_embeddings " +
    //                 "WHERE (embedding <=> cast(:queryVector as vector)) < :threshold " +
    //                 "ORDER BY (embedding <=> cast(:queryVector as vector)) ASC " +
    //                 "LIMIT :limit", nativeQuery = true)
    //     List<CvEmbedding> searchSemantic(
    //         @Param("queryVector") String queryVector, 
    //         @Param("threshold") double threshold, 
    //         @Param("limit") int limit
    //     );            
    
    @Query(value = """
    SELECT
        c.id,
        c.full_name,
        c.email,
        c.skills,
        ce.content,
        CAST(ce.embedding AS text) AS embedding
    FROM cvs c
    JOIN cv_embeddings ce
    ON c.id = ce.cv_id
    """, nativeQuery = true)
    List<Map<String,Object>> findAllCvEmbeddings();

    
}