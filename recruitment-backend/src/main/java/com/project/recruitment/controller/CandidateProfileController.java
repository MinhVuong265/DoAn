package com.project.recruitment.controller;

import com.project.recruitment.model.CandidateProfile;
import com.project.recruitment.service.CandidateProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/candidate/profile")
@CrossOrigin("*") // Ngăn lỗi CORS bảo mật trình duyệt
public class CandidateProfileController {

    @Autowired
    private CandidateProfileService profileService;

    // API 1: Xem thông tin Profile cá nhân của Ứng viên hiện tại
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable("userId") Long userId) {
        try {
            CandidateProfile profile = profileService.getProfileByUserId(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            // Nếu chưa tồn tại bản ghi, trả về thông điệp báo để Front-end chuẩn bị tạo mới
            return ResponseEntity.status(404).body(e.getLocalizedMessage());
        }
    }

    // API 2: Lưu thông tin cập nhật Profile (Tự động tính toán lại Vector định vị)
    @PutMapping("/{userId}/update")
    public ResponseEntity<?> updateProfile(@PathVariable("userId") Long userId, @RequestBody CandidateProfile updatedData) {
        if (updatedData.getFullName() == null || updatedData.getFullName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Họ và tên không được để trống.");
        }
        try {
            CandidateProfile savedProfile = profileService.saveOrUpdateProfile(userId, updatedData);
            return ResponseEntity.ok(savedProfile);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi khi lưu thông tin hồ sơ: " + e.getMessage());
        }
    }
}