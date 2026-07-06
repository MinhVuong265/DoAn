package com.project.recruitment.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "job_embeddings")
@Data
public class JobEmbedding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private JobPost job;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "embedding", nullable = false, columnDefinition = "vector")
    private String embedding;

//     @Column(
//     name="embedding",
//     columnDefinition="vector"
// )
//     private String embedding;
}
