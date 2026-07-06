package com.project.recruitment.service;

import java.util.List;

public interface AIService {
    
    // LLM Service - Gọi Large Language Model (Gemini/ChatGPT/Ollama)
    String generateResponse(String prompt);
    
    // Embedding Service - Chuyển text sang vector
    float[] generateEmbedding(String text);
    
    // Vector Search - Tìm kiếm tương tự trong Vector DB
    List<String> vectorSearch(float[] embedding, int limit);
    
    // RAG Service - Phối hợp Embedding -> Vector Search -> LLM
    String ragChat(String question);
    
    // Parse CV - Trích xuất thông tin từ CV
    String parseCV(byte[] cvFile);
    
    // Job Recommendation - Gợi ý công việc dựa trên hồ sơ
    List<Long> recommendJobs(Long candidateId);
}
