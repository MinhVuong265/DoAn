package com.project.recruitment.service;

import com.project.recruitment.repository.JobEmbeddingRepository;
import com.project.recruitment.model.JobPost;
import com.project.recruitment.model.User;
import com.project.recruitment.model.JobStatus;
import com.project.recruitment.repository.JobPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class JobPostService {

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private ChatbotRagService chatbotRagService;

    @Autowired
    private JobEmbeddingRepository jobEmbeddingRepository;

    @Autowired
    private UserService userService;


    @Transactional
    
public JobPost createJobPost(JobPost jobPost, Long employerId) {
    // 1. Lấy Employer và thiết lập dữ liệu
    User employer = userService.getUserById(employerId);
    jobPost.setEmployer(employer);
    
    // 2. Tạo rawContext
    String rawContext = String.format(
        "Tiêu đề: %s. Công ty: %s. Kỹ năng yêu cầu: %s. Mô tả công việc: %s. Yêu cầu ứng viên: %s.",
        jobPost.getTitle(), jobPost.getCompanyName(), jobPost.getSkillsTags(),
        jobPost.getDescription(), jobPost.getRequirements()
    );
    jobPost.setContentEmbedding(rawContext);

    // 3. Lưu JobPost duy nhất 1 lần và lấy ID
    JobPost savedJob = jobPostRepository.save(jobPost);
    
    // 4. Gọi phương thức tách biệt để lưu Vector
    // Đảm bảo phương thức saveJobVector bên dưới có @Transactional(propagation = Propagation.REQUIRES_NEW)
    try {
        List<Double> vectorResult = chatbotRagService.getEmbeddingService().getEmbedding(rawContext);
        String vectorString = vectorResult.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(",", "[", "]"));

        // Gọi qua một phương thức tách biệt (bước này cực kỳ quan trọng)
        saveJobVector(savedJob.getId(), rawContext, vectorString);
        
    } catch (Exception e) {
        System.err.println("Cảnh báo: Không thể sinh Vector Embedding cho JD: " + e.getMessage());
    }

    return savedJob;
}

// Phương thức này CẦN NẰM TRONG CÙNG CLASS (hoặc tốt hơn là chuyển sang service riêng)
// VỚI ANNOTATION DƯỚI ĐÂY:
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void saveJobVector(Long jobId, String content, String vectorString) {
    jobPostRepository.saveVector(jobId, content, vectorString);
}

    // 2. Lấy danh sách tất cả các tin tuyển dụng đang hoạt động (Hiển thị cho Ứng viên/Khách vãng lai)
    public List<JobPost> getAllActiveJobs() {
        return jobPostRepository.findByStatus(JobStatus.ACTIVE);
    }

    // 3. Lấy danh sách tin tuyển dụng của riêng một công ty/nhà tuyển dụng cụ thể
    public List<JobPost> getJobsByEmployer(Long employerId) {
        return jobPostRepository.findByEmployerIdOrderByCreatedAtDesc(employerId);
    }

    // 4. Lấy chi tiết một tin tuyển dụng theo ID
    public JobPost getJobById(Long id) {
        return jobPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng với ID: " + id));
    }

    
}