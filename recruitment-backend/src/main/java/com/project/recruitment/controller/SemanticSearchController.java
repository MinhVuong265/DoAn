package com.project.recruitment.controller;

import com.project.recruitment.service.SemanticSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/search")
@CrossOrigin(origins = "*")
public class SemanticSearchController {

    @Autowired
    private SemanticSearchService semanticSearchService;

    // Tìm kiếm việc làm cho ứng viên
 @  GetMapping("/jobs")
    public ResponseEntity<?> searchJobs(
            @RequestParam("keyword") String keyword,
            @RequestParam(value = "limit", defaultValue = "6") int limit) {
            
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Vui lòng nhập từ khóa tìm kiếm.");
        }
        
        List<Map<String, Object>> matchedJobs = semanticSearchService.searchJobsManually(keyword, limit);
        return ResponseEntity.ok(matchedJobs);
    }

    // Tìm kiếm CV/Ứng viên cho nhà tuyển dụng
    @GetMapping("/candidates")
    public ResponseEntity<?> searchCandidates(
            @RequestParam("description") String description,
            @RequestParam(value = "limit", defaultValue = "6") int limit) {
            
        if (description == null || description.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Vui lòng nhập mô tả công việc.");
        }
        
        List<Map<String, Object>> matchedCandidates = semanticSearchService.searchCandidatesManually(description, limit);
        return ResponseEntity.ok(matchedCandidates);
    }
}