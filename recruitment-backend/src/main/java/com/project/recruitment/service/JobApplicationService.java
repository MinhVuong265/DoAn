package com.project.recruitment.service;
import com.project.recruitment.repository.JobPostRepository;
import com.project.recruitment.repository.UserRepository;
import com.project.recruitment.repository.JobApplicationRepository;
import com.project.recruitment.model.JobApplication;
import com.project.recruitment.model.CandidateProfile;
import com.project.recruitment.repository.CandidateProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;
@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private CandidateProfileRepository profileRepository;

    @Autowired
    private JobPostRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void apply(Long jobId, Long candidateId){

        // Kiểm tra Job tồn tại
        jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Job"));

        // Kiểm tra User tồn tại
        userRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        // Đã ứng tuyển chưa
        if(applicationRepository.existsByJobIdAndUserId(jobId,candidateId)){
            throw new RuntimeException("Bạn đã ứng tuyển.");
        }

        Double score = applicationRepository.calculateSimilarity(jobId,candidateId);

        JobApplication application = new JobApplication();

        application.setJobId(jobId);

        application.setUserId(candidateId);

        application.setStatus("PENDING");

        application.setMatchingScore(
                score == null ? 0f : score.floatValue() * 100
        );

        applicationRepository.save(application);
    }

    public List<Map<String,Object>> getApplicantsForJob(Long jobId){
        return applicationRepository.findApplicantsByJobId(jobId);
    }
}