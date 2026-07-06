import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  PlusCircle, 
  ChevronRight, 
  Sparkles, 
  Calendar,
  Users,
  ArrowUpRight
} from 'lucide-react';

const JobListEmployer = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const { jobId } = useParams();
  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Lấy employerId từ localStorage
        const employerId = localStorage.getItem("userId");
        
        // Kiểm tra phòng hờ trường hợp chưa đăng nhập hoặc mất token/userId
        if (!employerId) {
          setError("Không tìm thấy thông tin tài khoản nhà tuyển dụng. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }

        // 2. Thêm await và gọi API chuẩn xác
        const response = await axios.get(`http://localhost:8080/api/jobs/employer/${employerId}`);
        
        // 3. Đọc dữ liệu từ response.data
        setJobs(response.data || []);

      } catch (err) {
        console.error("Lỗi khi lấy danh sách tin tuyển dụng:", err);
        setError("Không thể tải danh sách tin đăng. Vui lòng kiểm tra lại kết nối hệ thống.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* BANNER ĐẦU TRANG & NÚT ĐĂNG TIN NHANH */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-600" /> Tin tuyển dụng đã đăng
            </h1>
            <p className="text-xs text-gray-400 mt-1">Quản lý các chiến dịch tuyển dụng hiện có và theo dõi danh sách ứng viên thông qua công nghệ AI.</p>
          </div>
          <button 
            onClick={() => navigate('/employer/job-post')}
            className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> ĐĂNG TIN MỚI
          </button>
        </div>

        {/* HIỂN THỊ TRẠNG THÁI ĐANG TẢI (LOADING SKELETON) */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs animate-pulse flex justify-between items-center">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
                  <div className="h-3 bg-gray-100 rounded-md w-1/4"></div>
                  <div className="h-3 bg-gray-100 rounded-md w-1/2"></div>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* HIỂN THỊ THÔNG BÁO LỖI */}
        {error && !loading && (
          <div className="p-5 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-semibold text-center">
            {error}
          </div>
        )}

        {/* TRẠNG THÁI DANH SÁCH RỖNG (EMPTY STATE) */}
        {!loading && !error && jobs.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200 p-8 space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-800">Bạn chưa đăng tin tuyển dụng nào</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">Bắt đầu tiếp cận hàng ngàn ứng viên tiềm năng bằng cách khởi tạo vị trí công việc đầu tiên ngay hôm nay.</p>
            </div>
            <button 
              onClick={() => navigate('/employer/job-post')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition active:scale-95 shadow-sm inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> ĐĂNG TIN NGAY
            </button>
          </div>
        )}

        {/* DANH SÁCH TIN TUYỂN DỤNG THỰC TẾ */}
        {!loading && !error && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/employer/jobs/${job.id}`)}
                className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
              >
                {/* Viền trang trí bên cạnh khi hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 transition-transform scale-y-0 group-hover:scale-y-100"></div>

                <div className="space-y-3 flex-1">
                  <div className="space-y-1">
                    {/* Nhãn loại hình công việc */}
                    <span className="inline-flex px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md uppercase tracking-wider mb-1">
                      {job.jobType || "FULL_TIME"}
                    </span>
                    <h2 className="font-black text-base md:text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h2>
                  </div>

                  {/* Thông tin metadata của Job */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {job.companyName || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {job.location || "Toàn quốc"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" /> 
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString("vi-VN") : "Hôm nay"}
                    </span>
                  </div>
                </div>

                {/* Phần thống kê phụ & Nút tác vụ nhanh bên phải */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50">
                  <div className="flex items-center gap-3">
                    {/* Giả định số lượng ứng tuyển từ mock hoặc backend */}
                    {/* <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>{job.applicants || 0} hồ sơ</span>
                    </div> */}
                    {/* Nhãn điểm AI matching tối ưu */}
                    {/* <span className="inline-flex items-center gap-0.5 bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" /> Sàng lọc AI
                    </span> */}
                  </div>

                  {/* Nút mũi tên điều hướng */}
                  <div className="w-8 h-8 bg-gray-50 group-hover:bg-indigo-50 text-gray-400 group-hover:text-indigo-600 rounded-full flex items-center justify-center border border-gray-100/50 group-hover:border-indigo-100 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default JobListEmployer;