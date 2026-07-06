package com.project.recruitment.controller;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;


import com.project.recruitment.dto.request.JobPostRequest;
import com.project.recruitment.service.ChatbotRagService;
import com.project.recruitment.service.MatchingService;
import com.project.recruitment.service.EmbeddingService;
import com.project.recruitment.service.JobPostService;
import com.project.recruitment.service.JobApplicationService;
import com.project.recruitment.model.CandidateMatchDTO;
import com.project.recruitment.model.JobPost;
import com.project.recruitment.repository.JobPostRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "*")
public class JobPostController {

    @Autowired
    private JobPostService jobPostService;

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private EmbeddingService embeddingService;

    @Autowired
    private ChatbotRagService chatbotRagService;

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private JobApplicationService applicationService;
    
    // @PostMapping
    // public ResponseEntity<?> createJob(@RequestBody JobPost jobPost) {
    //     try {
    //         JobPost createdJob = jobPostService.createJobPost(jobPost);
    //         return ResponseEntity.ok(createdJob);
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    //     }
    // }

@GetMapping("/search")
    public ResponseEntity<?> searchJobs(
            @RequestParam String q,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Float salaryMin
    ) {
        try {
            List<Double> queryVectorList = embeddingService.getEmbedding(q);
            if (queryVectorList == null || queryVectorList.isEmpty()) {
                return ResponseEntity.badRequest().body("Không thể tạo vector cho từ khóa: " + q);
            }
            double[] queryVector = queryVectorList.stream().mapToDouble(Double::doubleValue).toArray();
            System.out.println("Debug - Query Vector Sample: " + queryVector[0] + ", " + queryVector[1] + "...");
            List<Map<String, Object>> allJobs = jobPostRepository.findAllEmbeddings();
            
            List<Map<String, Object>> results = allJobs.stream()
                .map(originalMap -> {
                    Map<String, Object> mutableJob = new HashMap<>(originalMap);
                    String embeddingStr = (String) mutableJob.get("embedding");
                    
                    // Debug: Kiểm tra xem chuỗi embedding có trống không
                    if (embeddingStr == null || embeddingStr.isEmpty()) {
                        System.out.println("Debug - Job ID: " + mutableJob.get("id") + " | Embedding string is NULL/EMPTY");
                        mutableJob.put("similarity", 0.0);
                        return mutableJob;
                    }

                    double[] dbVector = chatbotRagService.parseVector(embeddingStr);
                    
                    // Debug: Kiểm tra xem mảng parse ra có trống không
                    if (dbVector.length == 0) {
                        System.out.println("Debug - Job ID: " + mutableJob.get("id") + " | Parse failed, length 0. Raw: " + embeddingStr);
                    }

                    double score = chatbotRagService.calculateCosineSimilarity(queryVector, dbVector);
                    
                    mutableJob.put("similarity", score);
                    System.out.println("Debug - Job ID: " + mutableJob.get("id") + " | Score: " + score + " | Vector Length: " + dbVector.length);
                    return mutableJob;
                })
                .filter(job -> (double) job.get("similarity") >= 0.1)
                .sorted((a, b) -> Double.compare((double) b.get("similarity"), (double) a.get("similarity")))
                .collect(Collectors.toList());

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Lỗi tìm kiếm: " + e.getMessage());
        }
    }

    // API 1: Nhà tuyển dụng đăng tin tuyển dụng mới (Tự động chạy cơ chế sinh Vector)
    @PostMapping("/create")
    public ResponseEntity<?> createNewJob(@RequestBody JobPost jobPost, @RequestParam Long employerId) {
        if (jobPost.getTitle() == null || jobPost.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tiêu đề công việc không được để trống.");
        }
        try {
            JobPost savedJob = jobPostService.createJobPost(jobPost, employerId);
            return ResponseEntity.ok(savedJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi đăng tin tuyển dụng: " + e.getMessage());
        }
    }

    // API 2: Lấy tất cả danh sách việc làm ACTIVE (Cho trang chủ tìm kiếm của Candidate/Khách)
    @GetMapping("/active")
    public ResponseEntity<List<JobPost>> getActiveJobs() {
        List<JobPost> jobs = jobPostService.getAllActiveJobs();
        return ResponseEntity.ok(jobs);
    }

    // API 3: Xem chi tiết nội dung một công việc cụ thể
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobDetail(@PathVariable("id") Long id) {
        try {
            JobPost job = jobPostService.getJobById(id);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // API 4: Lấy danh sách tin tuyển dụng của riêng một Employer để hiển thị ở trang Dashboard quản lý
    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<JobPost>> getJobsByEmployerId(@PathVariable("employerId") Long employerId) {
        List<JobPost> jobs = jobPostService.getJobsByEmployer(employerId);
        return ResponseEntity.ok(jobs);
    }

    // @GetMapping
    // public ResponseEntity<List<JobPost>> getAllJobs() {
    //     return ResponseEntity.ok(jobPostService.getAllJobs());
    // }


    @PostMapping("/{jobId}/apply")
    public ResponseEntity<?> applyJob(@PathVariable Long jobId) {
        // Ứng tuyển vào công việc
        return ResponseEntity.ok("Applied successfully");
    }

    @GetMapping("/{jobId}/application-status")
    public ResponseEntity<?> getApplicationStatus(@PathVariable Long jobId) {
        // Lấy trạng thái ứng tuyển
        return ResponseEntity.ok("Application status");
    }

    @GetMapping("/recent")
    public List<Map<String, Object>> getRecentJobs() {
        // Lấy 5 tin tuyển dụng mới nhất sắp xếp theo createdAt giảm dần
        List<JobPost> jobs = jobPostRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();

        List<Map<String, Object>> result = new ArrayList<>();
        for (JobPost job : jobs) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", job.getId());
            map.put("title", job.getTitle());
            // Nếu muốn lấy tên công ty:
            map.put("company_name", job.getCompanyName()); 
            // Nếu bạn có bảng đếm ứng viên:
            map.put("applicants", 0); 
            result.add(map);
        }
        return result;
    }

    @GetMapping("/{jobId}/recommend-candidates")
    public List<CandidateMatchDTO> recommend(
    @PathVariable Long jobId){

        return matchingService.recommendCandidates(jobId);

    }

    @GetMapping("/{jobId}/applicants")
    public ResponseEntity<?> getApplicants(
            @PathVariable Long jobId){

        return ResponseEntity.ok(
                applicationService.getApplicantsForJob(jobId)
        );
    }
}
