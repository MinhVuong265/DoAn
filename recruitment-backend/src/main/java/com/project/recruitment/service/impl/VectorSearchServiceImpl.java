package com.project.recruitment.service.impl;

import com.project.recruitment.service.VectorSearchService;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
@RequiredArgsConstructor
@Slf4j
public class VectorSearchServiceImpl implements VectorSearchService {
    private static final Logger log = LoggerFactory.getLogger(VectorSearchServiceImpl.class);
    @Override
    public void indexContent(String content, String id) {
        log.info("Đang tiến hành index nội dung cho ID: {}", id);
    }

    @Override
    public java.util.List<String> search(String query, int limit) {
        log.info("Đang tìm kiếm ngữ nghĩa với câu truy vấn: {}, giới hạn: {}", query, limit);
        return java.util.Collections.emptyList();
    }
} // <--- ĐÂY LÀ DẤU NGOẶC CUỐI CÙNG CỦA CLASS, KHÔNG ĐỂ THỪA KÝ TỰ NÀO DƯỚI NÀY