import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Building2, Calendar, Briefcase, Award, GraduationCap, ArrowLeft, Sparkles } from 'lucide-react';
import axios from 'axios';
import toast from "react-hot-toast";
const JobDetails = () => {
  const { id } = useParams(); // Lấy ID bài đăng từ URL (ví dụ: /jobs/1)
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        // Gọi API lấy thông tin chi tiết của job gộp từ Spring Boot
        const response = await axios.get(`http://localhost:8080/api/jobs/${id}`);
        setJob(response.data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết công việc:", err);
        setError("Không thể tải thông tin công việc hoặc bài đăng không tồn tại.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);

      const candidateId = Number(localStorage.getItem("userId"));

      if (!candidateId) {
        toast.error("Vui lòng đăng nhập với tài khoản ứng viên!");
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:8080/api/applications/apply",
        null,
        {
          params: {
            jobId: job.id,
            candidateId: candidateId
          }
        }
      );

      toast.success("🎉 Ứng tuyển thành công!");

    } catch (err) {

      console.error(err);

      if (err.response?.status === 500) {
        toast("Bạn đã ứng tuyển công việc này.", {
          icon: "📄",
        });
      }
      else {
        toast.error("Ứng tuyển thất bại!");
      }

    } finally {
      setApplying(false);
    }
  };
  // Hàm định dạng lương hiển thị
  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    if (min && max) return `${(min / 1000000).toFixed(0)} - ${(max / 1000000).toFixed(0)} triệu VNĐ`;
    return min ? `Từ ${(min / 1000000).toFixed(0)} triệu` : `Đến ${(max / 1000000).toFixed(0)} triệu`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 text-sm font-medium">Đang tải chi tiết công việc...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-red-500 font-medium mb-4">{error || "Công việc không tồn tại"}</p>
          <button 
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Tách chuỗi kỹ năng tags thành mảng để hiển thị dạng nhãn (badge)
  const tagsArray = job.skillsTags ? job.skillsTags.split(',').map(t => t.trim()) : [];

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Nút quay lại nhanh */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-purple-600 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Quay lại trang trước
        </button>

        {/* 1. KHUNG HEADER TỔNG QUAN TIN TUYỂN DỤNG */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{job.title}</h1>
              <div className="flex items-center gap-2 text-base text-gray-700 font-medium">
                <Building2 className="w-4 h-4 text-gray-400" /> {job.companyName || "Công ty ẩn danh"}
              </div>
            </div>
            
            {/* Điểm Matching Score AI nếu có, mặc định là vùng phù hợp 85% */}
            <div className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl flex items-center gap-1.5 text-xs md:text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              Độ tương thích AI: {job.matchingscore || 85}%
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Grid thông tin nhanh hàng đầu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <DollarSign className="w-5 h-5 text-green-600 bg-green-50 p-1 rounded-lg" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Mức lương</p>
                <p className="font-semibold text-green-700">{formatSalary(job.salaryMin, job.salaryMax)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <MapPin className="w-5 h-5 text-blue-600 bg-blue-50 p-1 rounded-lg" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Địa điểm</p>
                <p className="font-medium text-gray-800">{job.location || "Toàn quốc"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Briefcase className="w-5 h-5 text-amber-600 bg-amber-50 p-1 rounded-lg" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Hình thức làm việc</p>
                <p className="font-medium text-gray-800">{job.jobType || "Chưa cập nhật"}</p>
              </div>
            </div>
          </div>

          {/* Hiển thị danh sách kỹ năng */}
          {tagsArray.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tagsArray.map((tag, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. KHUNG CHI TIẾT NỘI DUNG NẰM GỘP CHUNG MỘT BẢNG Cũ */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
          
          {/* Mục 1: Mô tả công việc */}
          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2 border-l-4 border-purple-600 pl-2.5">
              Mô tả công việc
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
              {job.description || "Chưa cập nhật nội dung mô tả chi tiết."}
            </p>
          </div>

          {/* Mục 2: Yêu cầu ứng viên */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2 border-l-4 border-purple-600 pl-2.5">
              Yêu cầu công việc
            </h2>
            <div className="text-sm md:text-base text-gray-600 leading-relaxed bg-amber-50/30 p-4 rounded-xl border border-amber-100/50 whitespace-pre-line">
              {job.requirements || "Chưa cập nhật nội dung yêu cầu tuyển dụng."}
            </div>
          </div>

          {/* Mục 3: Quyền lợi được hưởng */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2 border-l-4 border-purple-600 pl-2.5">
              Quyền lợi được hưởng
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
              {job.benefits || "Theo quy định của luật lao động và quy chế nội bộ công ty."}
            </p>
          </div>

          {/* Mục phụ: Kinh nghiệm yêu cầu */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs md:text-sm text-gray-500 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-500" /> Kinh nghiệm: <span className="font-semibold text-gray-700">{job.yearsExperienceRequired === 0 ? "Không yêu cầu" : `${job.yearsExperienceRequired} năm`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-500" /> Ngày đăng tin: <span className="font-semibold text-gray-700">{job.postedDate ? new Date(job.postedDate).toLocaleDateString('vi-VN') : "Vừa xong"}</span>
            </div>
          </div>

          {/* 3. NÚT NỘP HỒ SƠ ỨNG TUYỂN CHIẾN LƯỢC ĐỒ ÁN */}
          <div className="pt-4 flex justify-end">
            <button
                onClick={handleApply}
                disabled={applying}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-purple-200 hover:shadow-lg transition active:scale-95 disabled:opacity-50"
            >
                {applying ? "ĐANG ỨNG TUYỂN..." : "ỨNG TUYỂN NGAY BẰNG AI CV"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default JobDetails;