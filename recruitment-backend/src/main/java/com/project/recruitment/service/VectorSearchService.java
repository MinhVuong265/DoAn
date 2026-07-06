package com.project.recruitment.service;

import java.util.List;

/**
 * Interface cho Vector Search Service
 */
public interface VectorSearchService {
    void indexContent(String content, String id);
    List<String> search(String query, int topK);
}
