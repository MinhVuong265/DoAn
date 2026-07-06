package com.project.recruitment.service;
import com.project.recruitment.model.CandidateMatchDTO;
import com.project.recruitment.repository.CvEmbeddingRepository;
import com.project.recruitment.repository.JobEmbeddingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MatchingService {

    @Autowired
    private CvEmbeddingRepository cvRepository;

    @Autowired
    private JobEmbeddingRepository jobRepository;

    @Autowired
    private ChatbotRagService ragService;

    public List<CandidateMatchDTO> recommendCandidates(Long jobId){

        Map<String,Object> job=jobRepository.findJobEmbedding(jobId);

        double[] jobVector=
                ragService.parseVector(
                        job.get("embedding").toString());

        List<Map<String,Object>> cvs=
                cvRepository.findAllCvEmbeddings();

        List<CandidateMatchDTO> result=new ArrayList<>();

        for(Map<String,Object> cv:cvs){

            double[] cvVector=
                    ragService.parseVector(
                            cv.get("embedding").toString());

            double score=
                    ragService.calculateCosineSimilarity(jobVector,cvVector);

            CandidateMatchDTO dto=
                    new CandidateMatchDTO();

            dto.setCvId(((Number)cv.get("id")).longValue());

            dto.setFullName(cv.get("full_name").toString());

            dto.setEmail(cv.get("email").toString());

            dto.setSkills(cv.get("skills").toString());

            dto.setSimilarity(score*100);

            result.add(dto);
        }

        result.sort((a,b)->Double.compare(b.getSimilarity(),a.getSimilarity()));

        return result;
    }

}