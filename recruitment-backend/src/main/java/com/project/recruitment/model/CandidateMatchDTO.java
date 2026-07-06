package com.project.recruitment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateMatchDTO {

    private Long cvId;

    private String fullName;

    private String email;

    private String skills;

    private Double similarity;
}