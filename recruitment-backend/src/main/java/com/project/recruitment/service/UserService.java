package com.project.recruitment.service;

import com.project.recruitment.model.User;
import com.project.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Logic xử lý Đăng ký tài khoản mới
    public User registerUser(User user) {
        // Kiểm tra xem email đã tồn tại trong DB chưa
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email này đã được sử dụng trên hệ thống!");
        }
        
        // Tiến hành băm mã hóa bảo mật mật khẩu trước khi lưu vào PostgreSQL
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Logic xử lý Đăng nhập
    public User loginUser(String email, String rawPassword) {
        // Tìm user theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Tài khoản email không tồn tại!"));

        // So khớp mật khẩu thô người dùng nhập với mật khẩu đã băm trong DB
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        return user; // Đăng nhập thành công, trả về thông tin User
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại với ID: " + userId));
    }
}