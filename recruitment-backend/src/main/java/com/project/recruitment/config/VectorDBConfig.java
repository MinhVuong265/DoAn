package com.project.recruitment.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

/**
 * Cấu hình Vector Database (Milvus/Pinecone/pgvector)
 * Sử dụng cho semantic search với embeddings
 */
@Configuration
@ConditionalOnProperty(name = "vector.db.enabled", havingValue = "true")
public class VectorDBConfig {

    // Cấu hình kết nối đến Milvus (Default)
    // host: localhost
    // port: 19530
    
    // Hoặc Pinecone:
    // apiKey: từ env variable
    // environment: us-east1-aws (ví dụ)
    
    // Hoặc pgvector (PostgreSQL extension):
    // Sử dụng PostgreSQL thay vì MySQL
}
