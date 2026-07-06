// Gọi API cập nhật trạng thái ứng viên, xếp hạng
import api from './api';

const employerService = {
  // Lấy danh sách công việc đã đăng
  getPostedJobs: async (page = 1, limit = 10) => {
    const response = await api.get('/employer/jobs', {
      params: { page, limit }
    });
    return response.data;
  },

  // Đăng tin tuyển dụng
  postJob: async (jobData) => {
    const response = await api.post('/employer/jobs', jobData);
    return response.data;
  },

  // Cập nhật tin tuyển dụng
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/employer/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Xóa tin tuyển dụng
  deleteJob: async (jobId) => {
    const response = await api.delete(`/employer/jobs/${jobId}`);
    return response.data;
  },

  // Lấy danh sách ứng viên cho công việc (Có xếp hạng AI)
  getCandidatesForJob: async (jobId, sortBy = 'ai_ranking') => {
    const response = await api.get(`/employer/jobs/${jobId}/candidates`, {
      params: { sortBy }
    });
    return response.data;
  },

  // Cập nhật trạng thái ứng viên (pending, shortlisted, rejected, hired)
  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.put(`/employer/applications/${applicationId}`, { status });
    return response.data;
  },

  // Ghi chú cho ứng viên
  addCandidateNote: async (applicationId, note) => {
    const response = await api.post(`/employer/applications/${applicationId}/notes`, { note });
    return response.data;
  },

  // Lấy thống kê về chiến dịch tuyển dụng
  getCampaignStats: async () => {
    const response = await api.get('/employer/stats');
    return response.data;
  }
};

export default employerService;
