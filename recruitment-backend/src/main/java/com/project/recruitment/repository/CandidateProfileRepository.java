package com.project.recruitment.repository;

import com.project.recruitment.model.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    
    // Tìm kiếm hồ sơ dựa theo ID của User tài khoản đăng nhập
    Optional<CandidateProfile> findByUserId(Long userId);
}