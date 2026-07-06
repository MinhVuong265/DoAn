package com.project.recruitment.service.impl;

import com.project.recruitment.service.LLMService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Slf4j
public class LLMServiceImpl implements LLMService {
    private static final Logger log = LoggerFactory.getLogger(LLMServiceImpl.class);
    @Override
    public String generateResponse(String prompt) {
        log.info("Đang xử lý prompt gửi đến LLM: {}", prompt);
        return "Phản hồi mẫu từ hệ thống trí tuệ nhân tạo";
    }

    @Override
    public String classifyText(String text) {
        log.info("Đang phân tích và phân loại văn bản: {}", text);
        return "Kết quả phân loại mẫu";
    }
}