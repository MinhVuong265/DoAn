package com.project.recruitment.service.impl;

import com.project.recruitment.service.EmbeddingService;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmbeddingServiceImpl extends EmbeddingService {
    private static final Logger log = LoggerFactory.getLogger(EmbeddingServiceImpl.class);
    // @Override
    // public float[] embed(String text) {
        
    //     log.info("Đang tạo vector embedding (kiểu float[]) cho văn bản");
    //     return new float[]{0.1f, 0.2f, 0.3f}; // Thêm chữ 'f' đằng sau số thực để biểu diễn kiểu float
    // }
} // <--- ĐÂY LÀ DẤU NGOẶC CUỐI CÙNG CỦA CLASS, KHÔNG ĐỂ THỪA KÝ TỰ NÀO DƯỚI NÀY