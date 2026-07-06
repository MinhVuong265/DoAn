package com.project.recruitment.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Cấu hình JWT, Phân quyền (Candidate/Employer/Admin)
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Cấu hình CORS dựa trên cấu hình nguồn corsConfigurationSource bên dưới
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 2. Tắt CSRF bảo vệ (Vì chúng ta dùng API dạng Stateless - Token dựa trên JWT)
            .csrf(csrf -> csrf.disable())
            
            // 3. Cấu hình quản lý Session là STATELESS (Không lưu trạng thái phiên trên Server)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 4. PHÂN QUYỀN ĐƯỜNG DẪN API (Đã cập nhật chính xác tiền tố /api/...)
            .authorizeHttpRequests(auth -> auth
                // Cho phép tất cả các request Preflight (OPTIONS) đi qua tự do để tránh lỗi CORS
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                
                // Mở công khai các API đăng nhập, đăng ký, chatbot và upload file CV bằng AI
                .requestMatchers("/auth/**").permitAll() 
                .requestMatchers("/chatbot/**").permitAll()
                .requestMatchers("/cv/**").permitAll()
                .requestMatchers("/jobs/**").permitAll()
                .requestMatchers("/search/**").permitAll()
                .requestMatchers("/applications/**").permitAll()
                // --- PHÂN QUYỀN VAI TRÒ ĐỒ ÁN (Nếu em dùng JWT Filter hãy bật lên) ---
                // .requestMatchers("/api/candidate/**").hasRole("CANDIDATE")
                // .requestMatchers("/api/employer/**").hasRole("EMPLOYER")
                // .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Tạm thời cho phép tất cả các API profile, tuyển dụng khác đi qua để test giao diện dễ dàng:
                .requestMatchers("/candidate/**").permitAll()
                
                // Tất cả các request còn lại chưa được khai báo ở trên thì bắt buộc phải đăng nhập thành công
                .anyRequest().authenticated()
            )
            
            .formLogin(form -> form.disable()) 
            .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Đồng bộ cấu hình ánh xạ áp dụng cho toàn bộ endpoint bắt đầu bằng /api/
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000") // Hỗ trợ cả Vite (5173) và Create React App (3000)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Đồng bộ các domain nguồn Frontend được quyền gọi tài nguyên từ Backend sang
        configuration.setAllowedOrigins(java.util.Arrays.asList("http://localhost:3000", "http://localhost:5173")); 
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Áp dụng cấu hình CORS cho toàn bộ hệ thống
        return source;
    }
}