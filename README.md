# RecruitX - AI-Powered Recruitment Platform

Nền tảng tuyển dụng thông minh sử dụng AI để giúp ứng viên tìm công việc phù hợp và nhà tuyển dụng tìm những ứng viên tốt nhất.

## Cấu Trúc Dự Án

```
tên-dự-án-tuyển-dụng/
│
├── recruitment-frontend/           # [PHẦN FRONTEND - REACTJS/VITE]
│   └── ...
│
└── recruitment-backend/            # [PHẦN BACKEND - SPRING BOOT]
    └── ...
```

## Tính Năng Chính

### Phía Ứng Viên (Candidate)
- 🔍 Tìm kiếm ngữ nghĩa (Semantic Search) với AI
- 📄 Upload & Parse CV tự động (AI Extract)
- 💬 Chat với AI Assistant (RAG Chatbot)
- 🎯 Xem điểm matching (AI Ranking)
- ⭐ Ứng tuyển công việc

### Phía Nhà Tuyển Dụng (Employer)
- 📤 Đăng tin tuyển dụng
- 📊 Dashboard chiến dịch
- 👥 Danh sách ứng viên (với AI Ranking)
- 🤖 Xếp hạng ứng viên tự động
- 📝 Ghi chú quản lý ứng viên

### Admin
- 🔍 Duyệt tin tuyển dụng
- 👤 Quản lý người dùng

## Công Nghệ Sử Dụng

### Frontend
- React 18 + Vite
- Tailwind CSS
- Axios + React Router

### Backend
- Spring Boot 3.1
- Spring Security + JWT
- JPA/Hibernate + MySQL
- Milvus (Vector DB)
- OpenAI/Gemini API (LLM)

### Công Nghệ AI
- **Semantic Search**: Embedding + Vector DB
- **RAG Chatbot**: LLM + Vector Search + Context
- **CV Parser**: LLM + Document Processing (PDF/DOCX)
- **Matching Score**: Embedding comparision + LLM

## Hướng Dẫn Chạy

### Backend
```bash
cd recruitment-backend
mvn clean install
mvn spring-boot:run
# Server chạy tại http://localhost:8080/api
```

### Frontend
```bash
cd recruitment-frontend
npm install
npm run dev
# App chạy tại http://localhost:3000
```

## Biến Môi Trường

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080/api
```

### Backend (application.properties)
```
llm.api.key=your-api-key-here
llm.provider=openai
```

## Contributors
- Your Name

## License
MIT
