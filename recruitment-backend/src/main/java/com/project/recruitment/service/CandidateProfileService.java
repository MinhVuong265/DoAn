package com.project.recruitment.service;

import com.project.recruitment.model.CandidateProfile;
import com.project.recruitment.repository.CandidateProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class CandidateProfileService {

    @Autowired
    private CandidateProfileRepository profileRepository;

    @Autowired
    private ChatbotRagService chatbotRagService; // Tái sử dụng để gọi lấy Vector từ Gemini

    // 1. Lấy thông tin hồ sơ theo UserId
    public CandidateProfile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Chưa khởi tạo hồ sơ cho người dùng có ID: " + userId));
    }

    // 2. Lưu hoặc Cập nhật thông tin hồ sơ kèm tái tạo Vector AI định danh
    public CandidateProfile saveOrUpdateProfile(Long userId, CandidateProfile updatedData) {
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElse(new CandidateProfile());

        // Cập nhật các trường thông tin cơ bản
        profile.setUserId(userId);
        profile.setFullName(updatedData.getFullName());
        profile.setEmail(updatedData.getEmail());
        profile.setPhoneNumber(updatedData.getPhoneNumber());
        profile.setAvatarUrl(updatedData.getAvatarUrl());
        profile.setGithubUrl(updatedData.getGithubUrl());
        profile.setLinkedinUrl(updatedData.getLinkedinUrl());
        profile.setSummary(updatedData.getSummary());
        profile.setExperience(updatedData.getExperience());
        profile.setEducation(updatedData.getEducation());
        profile.setSkillsTags(updatedData.getSkillsTags());
        
        if (updatedData.getCvUrl() != null) {
            profile.setCvUrl(updatedData.getCvUrl());
        }

        // TỰ ĐỘNG HÓA AI: Gom toàn bộ năng lực cốt lõi thành văn bản thô tổng hợp
        String rawText = String.format(
            "Ứng viên: %s. Giới thiệu: %s. Kỹ năng cốt lõi: %s. Kinh nghiệm làm việc: %s. Học vấn: %s.",
            profile.getFullName(),
            profile.getSummary() != null ? profile.getSummary() : "",
            profile.getSkillsTags() != null ? profile.getSkillsTags() : "",
            profile.getExperience() != null ? profile.getExperience() : "",
            profile.getEducation() != null ? profile.getEducation() : ""
        );
        profile.setProfileSummaryRaw(rawText);

        // Gọi sang mô hình học máy LLM (Gemini) để sinh tọa độ Vector không gian
        try {
            var embeddingService = chatbotRagService.getEmbeddingService();
            if (embeddingService != null) {
                var vectorResult = embeddingService.getEmbedding(rawText);
                if (vectorResult != null && !vectorResult.isEmpty()) {
                    profile.setEmbedding(vectorResult.toString());
                }
            }
        } catch (Exception e) {
            System.err.println("Lỗi sinh Vector AI cho Profile của ứng viên: " + e.getMessage());
        }

        return profileRepository.save(profile);
    }
}