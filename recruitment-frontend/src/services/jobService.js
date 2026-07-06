// Gọi API tin tuyển dụng, tìm kiếm ngữ nghĩa
import api from './api';

const jobService = {
  // Tìm kiếm ngữ nghĩa (Semantic Search)
  searchJobs: async (query, filters = {}) => {
    const response = await api.get('/jobs/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  },

  // Lấy chi tiết tin tuyển dụng
  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Lấy danh sách tin tuyên dụng (phân trang)
  getJobs: async (page = 1, limit = 10) => {
    const response = await api.get('/jobs', {
      params: { page, limit }
    });
    return response.data;
  },

  // Lấy tin tuyên dụng gợi ý (dựa trên hồ sơ)
  getRecommendedJobs: async () => {
    const response = await api.get('/jobs/recommended');
    return response.data;
  },

  // Ứng tuyển vào công việc
  applyJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/apply`);
    return response.data;
  },

  // Lấy trạng thái ứng tuyển
  getApplicationStatus: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/application-status`);
    return response.data;
  },

  // Lấy danh sách công việc đã ứng tuyển
  getAppliedJobs: async () => {
    const response = await api.get('/jobs/applied');
    return response.data;
  }
};

export default jobService;
