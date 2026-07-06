package com.project.recruitment.controller;

import com.project.recruitment.model.CandidateMatchDTO;
import com.project.recruitment.model.JobApplication;
import com.project.recruitment.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.project.recruitment.service.MatchingService;
import java.util.List;
@RestController
@RequestMapping("/applications")
@CrossOrigin("*")
public class JobApplicationController {

    @Autowired
    private JobApplicationService applicationService;

    @Autowired
    private MatchingService matchingService;

    // API dành cho Ứng viên bấm nút Ứng tuyển
    @PostMapping("/apply")
    public ResponseEntity<?> apply(
            @RequestParam Long jobId,
            @RequestParam Long candidateId){

        applicationService.apply(jobId,candidateId);

        return ResponseEntity.ok("Ứng tuyển thành công");
    }

    // API dành cho Nhà tuyển dụng xem danh sách ứng viên nộp vào tin (Đã xếp hạng theo điểm AI)
    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getJobApplicants(@PathVariable("jobId") Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicantsForJob(jobId));
    }


}