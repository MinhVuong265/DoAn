package com.project.recruitment.service;

/**
 * Interface cho LLM Service
 */
public interface LLMService {
    String generateResponse(String prompt);
    String classifyText(String text);
}
