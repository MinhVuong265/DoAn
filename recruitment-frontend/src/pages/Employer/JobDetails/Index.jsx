import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  FileText, 
  Building2, 
  Calendar, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle,
  Phone,
  Mail,
  Award,
  Clock,
  XCircle,
  UserCheck
} from 'lucide-react';

const JobDetailsEmployer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingJob, setLoadingJob] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoadingJob(true);
        setError(null);
        
        // 1. Lấy thông tin chi tiết bài tuyển dụng
        const response = await axios.get(`http://localhost:8080/api/jobs/${id}`);
        setJob(response.data);

        // 2. Tự động tải danh sách ứng viên đã đăng ký nộp đơn cho Job này
        if (response.data) {
          await fetchAppliedCandidates();
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết tin tuyển dụng:", err);
        setError("Không thể lấy dữ liệu tin tuyển dụng. Vui lòng kiểm tra lại kết nối server.");
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const fetchAppliedCandidates = async () => {
    setLoadingApplicants(true);
    try {
      // Gọi API lấy danh sách đơn ứng tuyển đã nộp vào Job cụ thể
      const response = await axios.get(`http://localhost:8080/api/jobs/${id}/applicants`);
      console.log(response.data);
      setApplications(response.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách ứng viên đã ứng tuyển:", err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    return `${min ? (min / 1000000).toFixed(0) : 0} - ${max ? (max / 1000000).toFixed(0) : '...' } triệu`;
  };

  const getScoreColor = (score) => {
    const finalScore = Math.round(score);
    if (finalScore >= 85) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', bar: 'bg-green-500', value: finalScore };
    if (finalScore >= 70) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', bar: 'bg-blue-500', value: finalScore };
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', bar: 'bg-amber-500', value: finalScore };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150 uppercase tracking-wider">
            <UserCheck className="w-3 h-3" /> Gọi phỏng vấn
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-150 uppercase tracking-wider">
            <XCircle className="w-3 h-3" /> Từ chối
          </span>
        );
      case 'REVIEWING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-150 uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Đang xem xét
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150 uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Mới ứng tuyển
          </span>
        );
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-100 border-t-indigo-600 mx-auto"></div>
          <p className="text-sm text-gray-500 font-medium">Đang phân tích cấu trúc tin tuyển dụng...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl max-w-md text-center space-y-4">
          <p className="text-red-500 font-semibold">{error || "Không tìm thấy tin tuyển dụng này trên hệ thống."}</p>
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const skillsList = job.skillsTags ? job.skillsTags.split(',').map(s => s.trim()) : [];

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Nút quay lại */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> QUAY LẠI TRANG CHỦ
        </button>

        {/* 1. KHỐI THÔNG TIN CHUNG (JOB HEADER) */}
        {}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
            <div className="space-y-1.5">
              <span className="inline-flex px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                {job.jobType || "FULL_TIME"}
              </span>
              <h1 className="text-xl md:text-2xl font-black text-gray-950">{job.title}</h1>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400" /> {job.companyName}
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Mức lương đề xuất</p>
              <div className="text-lg md:text-xl font-black text-green-700 flex items-center gap-1">
                <DollarSign className="w-5 h-5 text-green-600 shrink-0" /> {formatSalary(job.salaryMin, job.salaryMax)}
              </div>
            </div>
          </div>

          {/* Các thẻ thuộc tính nhanh */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" /> 
              <span>Địa điểm: <strong className="text-gray-800">{job.location || "Toàn quốc"}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Briefcase className="w-4 h-4 text-indigo-500 shrink-0" /> 
              <span>Kinh nghiệm: <strong className="text-gray-800">{job.yearsExperienceRequired || 0} năm</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" /> 
              <span>Đăng lúc: <strong className="text-gray-800">{job.createdAt ? new Date(job.createdAt).toLocaleDateString("vi-VN") : "Hôm nay"}</strong></span>
            </div>
          </div>

          {/* Tags kỹ năng */}
          {skillsList.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase">Yêu cầu từ khóa chuyên môn</p>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((tag, idx) => (
                  <span key={idx} className="bg-indigo-50/50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-xl text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. CHI TIẾT NỘI DUNG TUYỂN DỤNG (JD & REQUIREMENTS) */}
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-gray-950 uppercase border-b border-gray-100 pb-2 flex items-center gap-1.5 text-indigo-600">
              <FileText className="w-4 h-4" /> Mô tả công việc (JD)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line text-justify">{job.description}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-gray-950 uppercase border-b border-gray-100 pb-2 flex items-center gap-1.5 text-indigo-600">
              <CheckCircle className="w-4 h-4" /> Yêu cầu ứng viên
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line text-justify">{job.requirements}</p>
          </div>
        </div>

        {/* 3. KHỐI DANH SÁCH ỨNG VIÊN ĐÃ ĐĂNG KÝ ỨNG TUYỂN */}
        {}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-gray-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 animate-pulse shrink-0" /> Danh sách ứng viên đã nộp hồ sơ
              </h2>
              <p className="text-[11px] text-gray-400">Dữ liệu các đơn ứng tuyển thực tế của vị trí này, được tự động so khớp và xếp hạng ưu tiên bởi AI.</p>
            </div>
            <div className="shrink-0 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black px-2.5 py-1.5 rounded-lg">
              {applications.length} ỨNG VIÊN
            </div>
          </div>

          {loadingApplicants ? (
            <div className="py-12 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-indigo-100 border-t-indigo-600 mx-auto"></div>
              <p className="text-xs text-gray-400">Đang đồng bộ hóa dữ liệu đơn ứng tuyển từ hệ thống...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs font-bold text-gray-400">Vị trí này hiện tại chưa có ứng viên nào đăng ký nộp hồ sơ.</p>
              <p className="text-[10px] text-gray-400 mt-1">Tin tuyển dụng đang hoạt động, danh sách sẽ được cập nhật ngay khi có ứng viên mới.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, idx) => {
                // app là một bản ghi JobApplication chứa các thuộc tính: id, cv, aiMatchScore, status, appliedAt
                const score = Number(app.matching_score || 0);

                const colors = getScoreColor(score);

                const skillsList = app.skills
                    ? app.skills.split(",").map(s => s.trim())
                    : [];

                return (
                  <div 
                    key={app.id || idx} 
                    className="p-5 border border-gray-100 rounded-2xl hover:border-purple-300 hover:shadow-xs transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white"
                  >
                    {/* Bên trái: Thông tin cá nhân ứng viên & Trạng thái nộp */}
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-black text-gray-900">{app.full_name || "Chưa cập nhật tên"}</h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
                          Khớp {colors.value}%
                        </span>
                        {getStatusBadge(app.status)}
                      </div>

                      {/* Thông tin liên hệ nhanh */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                        {app.email && (
                          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gray-400" /> {app.email}</span>
                        )}
                        {app.phone && (
                          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-400" /> {app.phone}</span>
                        )}
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Nộp ngày: {new Date(app.applied_at).toLocaleDateString("vi-VN")}</span>
                      </div>

                      {/* Thẻ kỹ năng trích xuất được */}
                      {skillsList.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {skillsList.slice(0, 5).map((skill, sIdx) => (
                            <span key={sIdx} className="bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-md text-[9px] font-semibold">
                              {skill}
                            </span>
                          ))}
                          {skillsList.length > 5 && (
                            <span className="text-[9px] text-gray-400 font-medium px-1.5 py-0.5">+{skillsList.length - 5}</span>
                          )}
                        </div>
                      )}

                      {/* Trích dẫn tóm tắt kinh nghiệm */}
                      {app.experience && (
                        <p className="text-[11px] text-gray-400 italic line-clamp-1">
                            "{app.experience}"
                        </p>
                    )}
                    </div>

                    {/* Bên phải: Thanh tiến trình hiển thị trực quan và Nút xem chi tiết ứng viên */}
                    <div className="w-full md:w-36 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-50">
                      <div className="w-24 bg-gray-100 rounded-full h-1.5 hidden md:block">
                        <div className={`h-1.5 rounded-full ${colors.bar}`} style={{ width: `${colors.value}%` }}></div>
                      </div>
                      <button 
                        onClick={() => navigate(`/employer/cv/${app.cv_id}`)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-0.5"
                      >
                        Xem hồ sơ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobDetailsEmployer;