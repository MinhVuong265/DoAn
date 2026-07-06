package com.project.recruitment.service;

import com.project.recruitment.repository.JobPostRepository;
import com.project.recruitment.repository.JobEmbeddingRepository;
import com.project.recruitment.model.CvEmbedding;
import com.project.recruitment.model.JobEmbedding;
import com.project.recruitment.model.JobPost;
import com.project.recruitment.model.CV;
import com.project.recruitment.repository.CvEmbeddingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SemanticSearchService {

    @Autowired
    private ChatbotRagService chatbotRagService;

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private JobEmbeddingRepository jobEmbeddingRepository;

    @Autowired
    private CvEmbeddingRepository cvEmbeddingRepository;

    public String processSemanticSearch(String query) {
        String prompt = "Phân tích yêu cầu tìm kiếm sau và trích xuất từ khóa quan trọng: " + query;
        return chatbotRagService.generateResponse(prompt);
    }

    /**
     * Tìm kiếm việc làm bằng Vector
     */
    public List<Map<String, Object>> searchJobsByVector(String vectorString, int limit) {
        return jobPostRepository.searchSemantic(vectorString, 0.5, limit);
    }

    /**
     * Tìm kiếm CV bằng Vector
     * Mở rộng: Sử dụng CvEmbeddingRepository để tìm kiếm ứng viên phù hợp
     */
    public List<Map<String, Object>> searchCVsByVector(String vectorString, int limit) {
        return cvEmbeddingRepository.searchSemantic(vectorString, 0.1, limit);
    }

     public List<Map<String, Object>> searchJobsManually(String keyword, int limit) {
        // 1. Tạo vector từ keyword
        List<Double> queryList = chatbotRagService.getEmbeddingService().getEmbedding(keyword);
        double[] queryVector = queryList.stream().mapToDouble(d -> d).toArray();
        
        // 2. Lấy toàn bộ dữ liệu từ DB (vì không dùng pgvector)
        List<JobEmbedding> allEmbeddings = jobEmbeddingRepository.findAll();
        ;
        
        // 3. Tính toán độ tương đồng và lọc
        return allEmbeddings.stream()
            .map(je -> {
                double[] dbVector = chatbotRagService.parseVector(je.getEmbedding());
                double score = chatbotRagService.calculateCosineSimilarity(queryVector, dbVector);
                JobPost job = je.getJob();
                Map<String, Object> map = new HashMap<>();
                map.put("id", je.getId());
                map.put("title", job.getTitle());
                map.put("companyName", job.getCompanyName());
                map.put("location", job.getLocation());
                map.put("salaryMin", job.getSalaryMin());
                map.put("salaryMax", job.getSalaryMax());
                map.put("skillsTags", job.getSkillsTags());
                map.put("score", score);

                map.put("matchingScore", Math.round(score * 100));
                return map;
            })
            
            .filter(m -> (double)m.get("score") > 0.2) // Ngưỡng tương đồng
            .sorted((a, b) -> Double.compare((double)b.get("score"), (double)a.get("score")))
            .limit(limit)
            .collect(Collectors.toList());
    }

    /**
     * Tìm kiếm ứng viên thủ công bằng cách so khớp Vector trong Java
     */
    public List<Map<String, Object>> searchCandidatesManually(String description, int limit) {

        List<Double> queryList =
                chatbotRagService.getEmbeddingService().getEmbedding(description);

        double[] queryVector =
                queryList.stream().mapToDouble(Double::doubleValue).toArray();

        List<CvEmbedding> allEmbeddings =
                cvEmbeddingRepository.findAll();

        return allEmbeddings.stream()

                .filter(ce -> ce.getEmbedding() != null)
                .filter(ce -> ce.getCv() != null)

                .map(ce -> {

                    double[] dbVector =
                            chatbotRagService.parseVector(ce.getEmbedding());

                    double score =
                            chatbotRagService.calculateCosineSimilarity(queryVector, dbVector);

                    CV cv = ce.getCv();

                    Map<String, Object> map = new HashMap<>();

                    map.put("id", cv.getId());
                    map.put("fullName", cv.getFullName());
                    map.put("email", cv.getEmail());
                    map.put("phone", cv.getPhone());
                    map.put("skills", cv.getSkills());
                    map.put("experience", cv.getExperience());
                    map.put("education", cv.getEducation());
                    map.put("summary", cv.getSummary());
                    map.put("fileName", cv.getFileName());

                    map.put("matchingScore", Math.round(score * 100));
                    map.put("score", score);

                    return map;
                })

                .filter(m -> ((Double) m.get("score")) >= 0.2)

                .sorted((a, b) ->
                        Double.compare(
                                (Double) b.get("score"),
                                (Double) a.get("score")
                        )
                )

                .limit(limit)

                .collect(Collectors.toList());
    }
}