# Backend README

# RecruitX Backend - API Documentation

## Tổng Quan
RecruitX Backend là RESTful API được xây dựng bằng Spring Boot, cung cấp các endpoint cho phía Frontend gọi để tìm kiếm công việc, quản lý hồ sơ, và sử dụng AI Chatbot.

## Tech Stack
- **Framework**: Spring Boot 3.1.0
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **Vector DB**: Milvus (cho semantic search)
- **LLM**: OpenAI API / Google Gemini / Ollama

## Cài Đặt

### Yêu Cầu
- JDK 17+
- Maven 3.8+
- MySQL 8.0+
- Milvus (optional, cho semantic search)

### Cấu Hình

1. Clone repository
2. Cấu hình database trong `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/recruitment_db
spring.datasource.username=root
spring.datasource.password=password
```

3. Cấu hình LLM API:
```properties
llm.api.key=your-api-key-here
```

4. Build và run:
```bash
mvn clean install
mvn spring-boot:run
```

Server sẽ chạy tại `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `GET /auth/me` - Lấy thông tin user

### Jobs
- `GET /jobs/search?q=keyword&location=HCM` - Tìm kiếm ngữ nghĩa
- `GET /jobs/{id}` - Lấy chi tiết job
- `POST /jobs/{jobId}/apply` - Ứng tuyển

### AI Services
- `POST /ai/chat` - Chat với Chatbot RAG
- `POST /ai/parse-cv` - Parse CV
- `POST /ai/match` - Tính matching score

## Cấu Trúc Dự Án

```
src/main/java/com/project/recruitment/
├── config/           # Configuration classes
├── controller/       # REST Controllers
├── model/            # JPA Entities
├── repository/       # Spring Data Repositories
├── service/          # Business Logic
├── dto/              # Data Transfer Objects
└── exception/        # Exception Handlers
```

## Có Thêm

- [ ] JWT Token Refresh
- [ ] File Upload to Cloud Storage
- [ ] Email Notifications
- [ ] Advanced Analytics
- [ ] A/B Testing

## License
MIT
