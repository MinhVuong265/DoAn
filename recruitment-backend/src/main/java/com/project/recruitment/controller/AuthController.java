package com.project.recruitment.controller;

import com.project.recruitment.dto.request.LoginRequest;
import com.project.recruitment.dto.request.RegisterRequest;
import com.project.recruitment.dto.response.ApiResponse;
import com.project.recruitment.dto.response.LoginResponse;
import com.project.recruitment.model.User;
import com.project.recruitment.model.UserRole;
import com.project.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    // Khởi tạo bộ mã hóa mật khẩu chuẩn Spring Security
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // 1. Kiểm tra định dạng dữ liệu đầu vào cơ bản
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Email không được để trống!"));
            }
            if (request.getPassword() == null || request.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Mật khẩu phải chứa tối thiểu 6 ký tự!"));
            }

            // 2. Kiểm tra trùng lặp tài khoản trong hệ thống
            if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiResponse(false, "Địa chỉ Email này đã được đăng ký trong hệ thống!"));
            }

            // 3. Khởi tạo đối tượng thực thể User và nạp dữ liệu từ DTO
            User newUser = new User();
            newUser.setEmail(request.getEmail().trim().toLowerCase());
            newUser.setFullName(request.getFullName().trim());
            newUser.setRole(UserRole.valueOf(request.getRole().toString().toUpperCase())); // Nhận ENUM CANDIDATE hoặc EMPLOYER từ FE gửi lên
            newUser.setIsActive(true);

            // 4. Tiến hành mã hóa bảo mật mật khẩu trước khi lưu vào Supabase
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            newUser.setPassword(encodedPassword);

            // 5. Lưu xuống cơ sở dữ liệu
            userRepository.save(newUser);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Đăng ký tài khoản thành công!"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Đã xảy ra lỗi hệ thống: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 1. Tìm kiếm tài khoản dựa trên Email người dùng nhập vào
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail().trim().toLowerCase());
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Tài khoản Email không tồn tại trên hệ thống!"));
            }

            User user = userOptional.get();

            // 2. Kiểm tra trạng thái hoạt động của tài khoản
            if (Boolean.FALSE.equals(user.getIsActive())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse(false, "Tài khoản của bạn hiện đang bị khóa!"));
            }

           
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Mật khẩu bảo mật không chính xác!"));
            }

            // 4. Khởi tạo dữ liệu phản hồi (Giai đoạn đầu chưa cài JWT cấu hình trả về thông tin cơ bản)
            LoginResponse loginResponse = new LoginResponse(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.getIsActive()
            );

            return ResponseEntity.ok(loginResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Lỗi xử lý đăng nhập: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        // Tạm thời trả về thông báo (Sẽ hoàn thiện khi tích hợp bộ lọc Filter của JWT Token ở bước sau)
        return ResponseEntity.ok(new ApiResponse(true, "Tính năng lấy thông tin Token hiện tại đang được cấu hình."));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Phía Client (ReactJS) chỉ cần xóa Token trong localStorage/Cookie là hoàn thành đăng xuất
        return ResponseEntity.ok(new ApiResponse(true, "Đăng xuất thành công!"));
    }
}