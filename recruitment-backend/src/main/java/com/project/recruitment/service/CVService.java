package com.project.recruitment.service;

import com.project.recruitment.model.CV;
import com.project.recruitment.model.User;
import com.project.recruitment.repository.UserRepository;
import com.project.recruitment.repository.CVRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation; // Nhớ import dòng này

@Service
public class CVService {

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private UserRepository userRepository;

    // THÊM THUỘC TÍNH propagation VÀO ĐÂY:
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public CV createNewCV(
            String fileName,
            String fullName,
            String email,
            String phone,
            String skills,
            String experience,
            String education,
            String summary,
            Long userId) {
                
        CV cv = cvRepository.findByUserId(userId)
            .orElse(new CV());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        cv.setUser(user);

        cv.setFileName(fileName);
        cv.setFullName(fullName);
        cv.setEmail(email);
        cv.setPhone(phone);
        cv.setSkills(skills);
        cv.setExperience(experience);
        cv.setEducation(education);
        cv.setSummary(summary);

        CV savedCV = cvRepository.saveAndFlush(cv);

        return savedCV;
    }

    public CV getCVById(Long id) {
        return cvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy CV"));
    }
}