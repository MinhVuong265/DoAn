import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  PlusCircle,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';
import SearchBar from './SearchBar'; // 1. Nhập Component SearchBar của em vào đây

const Dashboard = () => {
  const navigate = useNavigate();

  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Gọi API đến endpoint đã khai báo trong JobPostController
        const response = await axios.get('http://localhost:8080/api/jobs/recent');
        setRecentJobs(response.data);
      } catch (error) {
        console.error("Lỗi khi tải tin tuyển dụng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  
  // Giả lập dữ liệu thống kê tổng quan
  const stats = [
    { id: 1, name: 'Tin tuyển dụng đang chạy', value: '12', icon: Briefcase, change: '+2 tin mới tuần này', changeType: 'positive' },
    { id: 2, name: 'Tổng số hồ sơ ứng tuyển', value: '148', icon: Users, change: '+28% so với tháng trước', changeType: 'positive' },
    { id: 3, name: 'Hồ sơ đạt tiêu chuẩn AI (>75%)', value: '42', icon: FileText, change: 'Tỷ lệ match đạt 28.3%', changeType: 'neutral' },
    { id: 4, name: 'Chi phí quy đổi/Ứng viên', value: '180,000 đ', icon: TrendingUp, change: '-15% tiết kiệm nhờ lọc AI', changeType: 'positive' },
  ];

  // Giả lập dữ liệu phân tích thông minh từ mô hình LLM dựa trên phễu tuyển dụng hiện tại
  const [aiInsights, setAiInsights] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Cảnh báo khoảng trống kỹ năng (Skill Gap)',
      content: 'Tin tuyển dụng "Java / Spring Boot" nhận được nhiều CV nhưng có đến 40% ứng viên bị chấm điểm thấp (<60%) do thiếu hụt kiến thức về Docker và Microservices. Bạn nên cân nhắc giảm bớt trọng số phần này hoặc bổ sung chương trình đào tạo nội bộ khi onboarding.'
    },
    {
      id: 2,
      type: 'success',
      title: 'Tối ưu hóa ngân sách tuyển dụng',
      content: 'Hệ thống AI Matching đã tự động sàng lọc và loại bỏ 65 hồ sơ không trùng khớp ngữ nghĩa ngay từ vòng nộp đơn, giúp tiết kiệm khoảng 14 giờ làm việc của bộ phận HR trong tuần qua.'
    },
    {
      id: 3,
      type: 'info',
      title: 'Gợi ý thị trường & Dải lương',
      content: 'Dữ liệu tuyển dụng toàn hệ thống cho thấy vị trí "Backend Engineer (Java)" với mức lương 20 - 35 triệu hiện có tỷ lệ cạnh tranh rất cao. Để thu hút thêm ứng viên thuộc top 10% AI Ranking, bạn có thể bổ sung phúc lợi "Làm việc Remote 2 ngày/tuần" vào JD.'
    }
  ]);

  // 2. Hàm xử lý khi Nhà tuyển dụng bấm nút "AI Search" trên ô tìm kiếm
  const handleEmployerSearch = (query) => {
    console.log("Nhà tuyển dụng tìm kiếm ứng viên bằng AI:", query);
    // Chuyển hướng sang trang quản lý ứng viên kèm theo từ khóa tìm kiếm ngữ nghĩa
    navigate(`/employer/candidates?ai_query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6"> {/* Đổi space-y-8 thành space-y-6 cho khoảng cách đều và đẹp */}
        
        {/* THANH CHÀO MỪNG ĐẦU TRANG + NÚT TÁC VỤ NHANH */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div>
            <h1 className="text-2xl font-black text-gray-950">Xin chào, Nhà tuyển dụng! 👋</h1>
            <p className="text-xs text-gray-400 mt-0.5">Dưới đây là hiệu suất và phân tích thông minh cho các chiến dịch tuyển dụng của bạn.</p>
          </div>
          <button 
            onClick={() => navigate('/employer/job-post')}
            className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> ĐĂNG TIN TUYỂN DỤNG MỚI
          </button>
        </div>

        {/* 3. NHÚNG THANH TÌM KIẾM AI SEMANTIC SEARCH VÀO ĐÂY */}
        {/* <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="text-center sm:text-left px-4 pt-2">
            <h2 className="text-sm font-bold text-gray-800 flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" /> Truy vấn ứng viên nhanh bằng AI
            </h2>
          </div> */}
          {/* Gọi prop onSearchSubmit bằng hàm handleEmployerSearch vừa viết ở trên */}
          {/* <EmployerSearchBar onSearchSubmit={handleEmployerSearch} /> */}
          {/* <div>Search Bar</div>
        </div> */}

        {/* 1. KHỐI THẺ THỐNG KÊ (GRID STATS CARDS) */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{stat.name}</span>
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-500 border border-gray-100">
                    <Icon className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                  <p className={`text-[11px] font-semibold mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            );
          })}
        </div> */}

        {/* CẤU TRÚC CHIA HAI CỘT LỚN: TRÁI (TIN ĐĂNG) - PHẢI (AI INSIGHTS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* BÊN TRÁI (CHIẾM 7 CỘT): CHIẾN DỊCH TUYỂN DỤNG HIỆN TẠI */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Chiến dịch tuyển dụng gần đây</h3>
              <button 
                onClick={() => navigate('/employer/candidates')}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
              >
                Xem tất cả bài đăng <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="py-4 text-center text-xs text-gray-400 animate-pulse">Đang tải...</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentJobs.length > 0 ? (
                    recentJobs.map((job) => (
                      <div key={job.id} className="py-3.5 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-800">{job.title}</h4>
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-xs font-bold border border-indigo-100">
                          {job.applicants || 0} ứng viên
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-xs text-gray-400">
                      Chưa có chiến dịch tuyển dụng nào hoạt động.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* BÊN PHẢI (CHIẾM 5 CỘT): TRUNG TÂM PHÂN TÍCH TRÍ TUỆ NHÂN TẠO (AI INSIGHTS CENTER) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-gray-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl space-y-4 relative overflow-hidden">
            {/* Hiệu ứng background mờ lấp lánh */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-2xl"></div>
            
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <div className="p-1.5 bg-white/10 rounded-lg text-yellow-400">
                <BrainCircuit className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wide uppercase flex items-center gap-1.5 text-white">
                  AI Recruitment Insights
                </h3>
                <p className="text-[10px] text-indigo-200">Phân tích sâu phễu dữ liệu bằng mô hình học máy</p>
              </div>
            </div>

            {/* Danh sách các khuyến nghị của AI */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {aiInsights.map((insight) => (
                <div 
                  key={insight.id} 
                  className={`p-3 rounded-xl text-xs leading-relaxed border backdrop-blur-md ${
                    insight.type === 'warning' 
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' 
                      : insight.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' 
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 text-yellow-400" />
                    <span>{insight.title}</span>
                  </div>
                  <p className="text-gray-300 text-justify text-[11px] font-medium leading-normal">
                    {insight.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;