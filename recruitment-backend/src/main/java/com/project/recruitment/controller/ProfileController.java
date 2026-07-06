package com.project.recruitment.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @GetMapping
    public ResponseEntity<?> getProfile() {
        // Lấy profile của user hiện tại
        return ResponseEntity.ok("Profile data");
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> profileData) {
        // Cập nhật profile
        return ResponseEntity.ok("Profile updated");
    }

    @PostMapping("/upload-cv")
    public ResponseEntity<?> uploadCV(@RequestParam MultipartFile file) {
        // Upload file CV (lưu vào storage)
        return ResponseEntity.ok("CV uploaded");
    }

    @PostMapping("/parse-cv")
    public ResponseEntity<?> parseCV(@RequestParam MultipartFile file) {
        // Parse CV dùng LLM (trích xuất skill, kinh nghiệm, etc)
        return ResponseEntity.ok("CV parsed");
    }

    @PostMapping("/skills")
    public ResponseEntity<?> addSkill(@RequestBody Map<String, String> skillData) {
        // Thêm skill cho profile
        return ResponseEntity.ok("Skill added");
    }

    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<?> removeSkill(@PathVariable Long skillId) {
        // Xóa skill
        return ResponseEntity.ok("Skill removed");
    }
}

