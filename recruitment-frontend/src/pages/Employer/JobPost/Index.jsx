import React, { useState } from 'react';
import axios from 'axios';
import { Briefcase, MapPin, DollarSign, FileText, PlusCircle, CheckCircle } from 'lucide-react';

const JobPostForm = () => {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    skillsTags: '',
    companyName: '',
    salaryMin: '',
    salaryMax: '',
    location: '',
    jobType: 'FULL_TIME',
    yearsExperienceRequired: 0,

  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setSuccess(false);

    try {
      const employerId = Number(localStorage.getItem("userId"));
      await axios.post(
        "http://localhost:8080/api/jobs/create",
        {
          ...formData,
          salaryMin: Number(formData.salaryMin) * 1000000,
          salaryMax: Number(formData.salaryMax) * 1000000,
          yearsExperienceRequired: Number(formData.yearsExperienceRequired),
        },
        {
          params: {
            employerId: employerId,
          },
        }
      );
      setSuccess(true);
      // Reset form
      setFormData({
        title: "",
        description: "",
        requirements: "",
        benefits: "",
        skillsTags: "",
        companyName: "",
        salaryMin: "",
        salaryMax: "",
        location: "",
        jobType: "FULL_TIME",
        yearsExperienceRequired: 0,
      });

    } catch (err) {
      console.error("Lỗi khi đăng tin:", err);
      alert("Đăng tin thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
        <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-6">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Đăng Tin Tuyển Dụng Mới</h1>
            <p className="text-xs text-gray-400 mt-0.5">Hệ thống AI sẽ tự động phân tích JD để khớp nối với các ứng viên tiềm năng.</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-2 border border-emerald-100 text-sm font-semibold">
            <CheckCircle className="w-5 h-5" /> Đăng tin và đồng bộ dữ liệu AI thành công!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tên công ty</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tiêu đề vị trí tuyển dụng</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Ví dụ: Senior Java Developer" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hình thức việc làm</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-indigo-500">
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="REMOTE">Remote (Từ xa)</option>
                <option value="INTERN">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Địa điểm làm việc</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ví dụ: Cầu Giấy, Hà Nội" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Số năm kinh nghiệm</label>
              <input type="number" name="yearsExperienceRequired" value={formData.yearsExperienceRequired} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Lương tối thiểu (Triệu)</label>
              <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Lương tối đa (Triệu)</label>
              <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kỹ năng yêu cầu (Tags)</label>
            <input type="text" name="skillsTags" value={formData.skillsTags} onChange={handleChange} placeholder="Gõ ngăn cách bằng dấu phẩy, ví dụ: Java, Spring Boot, MySQL" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-indigo-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mô tả công việc (JD)</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-indigo-500"></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Yêu cầu ứng viên</label>
            <textarea name="requirements" rows="4" value={formData.requirements} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-indigo-500"></textarea>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50">
            {isLoading ? "Hệ thống AI đang khởi tạo Vector..." : "XÁC NHẬN ĐĂNG TIN TUYỂN DỤNG"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;