package com.project.recruitment.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Cấu hình API Client cho AI (Gemini/ChatGPT/Ollama)
 */
@Configuration
@EnableConfigurationProperties
public class LLMConfig {

    // Cấu hình từ application.properties:
    // llm.provider=gemini (hoặc openai, ollama)
    // llm.api.key=<API_KEY>
    // llm.model=gemini-pro (hoặc gpt-4, gpt-3.5-turbo, etc)
    // llm.temperature=0.7
    // llm.max-tokens=2048
    
    // Ví dụ sử dụng:
    // - Gemini API: https://ai.google.dev/tutorials/rest_quickstart
    // - OpenAI API: https://platform.openai.com/docs/api-reference
    // - Ollama: http://localhost:11434/api/generate (local)
}
