// Gọi API Chatbot RAG, Gửi file parse CV
import api from './api';

const aiService = {
  // Gửi câu hỏi cho Chatbot RAG
  sendChatMessage: async (message) => {
    const response = await api.post('/ai/chat', { message });
    return response.data;
  },

  // Upload và parse CV với AI
  parseCV: async (formData) => {
    const response = await api.post('/ai/parse-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Lấy gợi ý công việc dựa trên CV
  getJobRecommendationFromCV: async (cvData) => {
    const response = await api.post('/ai/job-recommendation', cvData);
    return response.data;
  },

  // Tính điểm match giữa CV và Job Description
  calculateMatchScore: async (cvId, jobId) => {
    const response = await api.post('/ai/match', { cvId, jobId });
    return response.data;
  },

  // Dự đoán mức lương
  predictSalary: async (jobInfo) => {
    const response = await api.post('/ai/salary-prediction', jobInfo);
    return response.data;
  }
};

export default aiService;
