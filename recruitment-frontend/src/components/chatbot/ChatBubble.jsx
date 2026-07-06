import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, DollarSign, Building2, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import jobService from '../../services/jobService';

const JobList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Đọc tham số tìm kiếm từ URL (?search=...)
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('search') || '';

  // Các trạng thái của trang
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm gọi API tìm kiếm ngữ nghĩa
  const fetchSemanticSearchResults = async (query) => {
    setLoading(true);
    try {
      // Trong thực tế, em sẽ gọi API Backend Spring Boot:
      // const response = await jobService.searchSemantic(query);
      // setJobs(response.data);

      // Dưới đây là dữ liệu giả lập có cấu trúc chuẩn đầu ra của Vector Search (kèm điểm Score)
      const mockApiData = [
        {
          id: 1,
          title: "Chuyên viên Lập trình Java / Spring Boot",
          company: "Tập đoàn Công nghệ AI NextGen",
          location: "Cầu Giấy, Hà Nội",
          salary: "18 - 25 triệu",
          matchingScore: 94, // Điểm số từ phép toán Cosine Similarity ở Backend
          tags: ["Java", "Spring Boot", "MySQL", "OOP"]
        },
        {
          id: 2,
          title: "Backend Engineer (Java & Microservices)",
          company: "Giải pháp Số Toàn Cầu (GDS)",
          location: "Quận 1, TP. Hồ Chí Minh",
          salary: "20 - 35 triệu",
          matchingScore: 87,
          tags: ["Java", "Microservices", "Docker", "PostgreSQL"]
        },
        {
          id: 3,
          title: "Fullstack Developer (ReactJS & Node.js)",
          company: "FTech Ecosystem",
          location: "Từ Liêm, Hà Nội",
          salary: "15 - 22 triệu",
          matchingScore: 62, // Điểm thấp hơn vì câu truy vấn thiên về Java nhưng tin này làm Node.js
          tags: ["ReactJS", "Node.js", "MongoDB"]
        }
      ];

      // Giả lập độ trễ mạng 0.8 giây
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Lọc danh sách giả lập dựa trên việc có nhập từ khóa hay không
      if (query.trim() === '') {
        setJobs(mockApiData);
      } else {
        // Sắp xếp mặc định theo điểm Matching Score giảm dần
        setJobs(mockApiData.sort((a, b) => b.matchingScore - a.matchingScore));
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm ngữ nghĩa:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chạy lại hàm tìm kiếm mỗi khi tham số URL thay đổi
  useEffect(() => {
    fetchSemanticSearchResults(initialQuery);
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Cập nhật lại URL mà không làm load lại trang
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Hàm trả về màu sắc của Badge dựa trên độ phù hợp AI
  const getScoreColor = (score) => {
    if (score >= 85) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', bar: 'bg-green-500' };
    if (score >= 70) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', bar: 'bg-blue-500' };
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', bar: 'bg-amber-500' };
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* 1. THANH TÌM KIẾM ĐẦU TRANG (MINI SEARCH HEADER) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
              <Sparkles className="w-5 h-5 text-purple-500 ml-4 animate-pulse" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập kỹ năng, kinh nghiệm hoặc mong muốn việc làm..."
                className="w-full py-3 pl-3 pr-4 bg-transparent text-gray-700 focus:outline-none text-sm md:text-base"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-sm"
            >
              <Search className="w-4 h-4" /> TÌM BẰNG AI
            </button>
          </form>
        </div>

        {/* TIÊU ĐỀ KẾT QUẢ */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              {initialQuery ? `Kết quả tìm kiếm phù hợp cho: "${initialQuery}"` : "Tất cả việc làm gợi ý"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Danh sách được sắp xếp tự động dựa trên mức độ tương đồng ngữ nghĩa</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-600 hover:bg-gray-50 transition">
            <SlidersHorizontal className="w-4 h-4" /> Lọc cứng
          </button>
        </div>

        {/* 2. HIỂN THỊ TRẠNG THÁI LOADING / DANH SÁCH TIN TUYỂN DỤNG */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-40 w-full animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">Không tìm thấy công việc nào phù hợp với ngữ nghĩa câu hỏi của bạn.</p>
            <p className="text-xs text-gray-400 mt-1">Hãy thử diễn đạt lại câu truy vấn rõ ràng hơn về mặt kỹ năng chuyên môn.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const colors = getScoreColor(job.matchingScore);
              return (
                <div 
                  key={job.id}
                  className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 relative group flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  {/* BÊN TRÁI: THÔNG TIN CHI TIẾT TIN TUYỂN DỤNG */}
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Building2 className="w-4 h-4 text-gray-400" /> {job.company}
                    </div>
                    
                    {/* Các thẻ thông tin nhanh */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-1">
                      <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location}</div>
                      <div className="flex items-center gap-1 font-semibold text-green-700"><DollarSign className="w-3.5 h-3.5 text-green-600" /> {job.salary}</div>
                    </div>

                    {/* Các thẻ từ khóa kỹ năng (Skills Tags) */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.tags.map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* BÊN PHẢI: KHU VỰC THÀNH PHẦN AI MATCHING SCORE */}
                  <div className="w-full md:w-48 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                    
                    {/* Khung hiển thị điểm số phần trăm AI */}
                    <div className={`px-3 py-1.5 rounded-xl border ${colors.bg} ${colors.text} ${colors.border} flex items-center gap-1 text-xs md:text-sm font-bold shadow-sm`}>
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      Hợp: {job.matchingScore}%
                    </div>

                    {/* Thanh tiến trình hiển thị trực quan (Progress Bar) */}
                    <div className="w-24 bg-gray-100 rounded-full h-1.5 hidden md:block">
                      <div className={`h-1.5 rounded-full ${colors.bar}`} style={{ width: `${job.matchingScore}%` }}></div>
                    </div>

                    {/* Nút bấm chuyển tiếp sang trang chi tiết công việc */}
                    <button 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 group/btn transition"
                    >
                      Xem chi tiết <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default JobList;