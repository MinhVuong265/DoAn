package com.project.recruitment.dto.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String role; // CANDIDATE, EMPLOYER, ADMIN
}