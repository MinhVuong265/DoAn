package com.project.recruitment.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {

    @Value("${gemini.api-key}")
    private String apiKey;
    @Value("${embedding.url}")
    private String embeddingUrl;

    private final RestTemplate restTemplate = new RestTemplate();


    // public List<Double> getEmbedding(String text) {
    //     // Sử dụng mô hình chuyên dụng sinh Vector mã hiệu: text-embedding-004
    //     String url = "https://generativelanguage.googleapis.com/v1/models/gemini-embedding-001:embedContent?key=" + apiKey;

    //     try {
    //         // Cấu trúc Request JSON chuẩn của Google Embedding API
    //         Map<String, Object> requestBody = new HashMap<>();
    //         Map<String, Object> content = new HashMap<>();
    //         Map<String, Object> parts = new HashMap<>();
            
    //         parts.put("text", text);
    //         content.put("parts", List.of(parts));
    //         requestBody.put("content", content);

    //         // Gọi API sang Google
    //         Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);

    //         // Bóc tách mảng số Vector trả về
    //         Map<?, ?> embeddingMap = (Map<?, ?>) response.get("embedding");
    //         List<Double> values = (List<Double>) embeddingMap.get("values");

    //         return values; // Trả về mảng chuỗi số tọa độ (ví dụ: [0.023, -0.012, 0.456,...])
    //     } catch (Exception e) {
    //         throw new RuntimeException("Lỗi sinh Vector Embedding từ Google: " + e.getMessage());
    //     }
    // }

    public List<Double> getEmbedding(String text) {

        Map<String, String> body = new HashMap<>();
        body.put("text", text);

        ResponseEntity<List> response =
                restTemplate.postForEntity(embeddingUrl, body, List.class);

        List<?> result = response.getBody();

        return result.stream()
                .map(v -> ((Number) v).doubleValue())
                .toList();
    }
}