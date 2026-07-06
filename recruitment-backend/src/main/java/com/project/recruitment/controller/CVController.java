package com.project.recruitment.controller;
import com.project.recruitment.model.CV;
import com.project.recruitment.service.CVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cv")
@CrossOrigin(origins = "*")
public class CVController {

    @Autowired
    private CVService cvService;

    @GetMapping("/{id}")
    public ResponseEntity<CV> getCVById(@PathVariable Long id) {
        return ResponseEntity.ok(cvService.getCVById(id));
    }
}
