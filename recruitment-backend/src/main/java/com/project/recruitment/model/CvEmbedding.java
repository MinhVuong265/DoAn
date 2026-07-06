package com.project.recruitment.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cv_embeddings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvEmbedding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id", nullable = false) // Hibernate tự map cột này thành cv_id trong DB
    private CV cv;


    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    // BỔ SUNG THUỘC TÍNH NÀY ĐỂ LOMBOK TỰ SINH HÀM SETTER/GETTER
    @Column(name = "embedding", nullable = false, columnDefinition = "vector")
    private String embedding; 
}