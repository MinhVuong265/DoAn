import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, DollarSign, Building2, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import axios from 'axios'; // Đã tích hợp Axios trực tiếp để gọi API

const JobList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Đọc từ khóa từ URL một cách an toàn
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm gọi API tìm kiếm
const fetchJobs = async (keyword) => {

    setLoading(true);
    try {
        const url =
            keyword
            ? `http://localhost:8080/api/search/jobs?keyword=${encodeURIComponent(keyword)}`
            : `http://localhost:8080/api/jobs/active`;
        const { data } = await axios.get(url);
        setJobs(data);
    } finally {
        setLoading(false);
    }
};

  // Đồng bộ state và gọi API khi URL search thay đổi
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
    fetchJobs(query);
  }, [location.search]);

 const handleSearchSubmit = (e) => {

    e.preventDefault();

    if (searchQuery.trim()) {

        navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);

    } else {

        navigate("/jobs");

    }

};

  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    return `${min ? (min / 1000000).toFixed(0) : 0} - ${max ? (max / 1000000).toFixed(0) : '...' } triệu`;
  };


  // Hàm cấu hình màu sắc hiển thị điểm số AI (Giả lập hoặc lấy từ matchingScore của bản ghi nếu có)
  const getScoreColor = (score) => {
    const finalScore = score || 80; // Nếu chưa có điểm từ thuật toán AI, mặc định hiển thị vùng an toàn 80%
    if (finalScore >= 85) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', bar: 'bg-green-500', value: finalScore };
    if (finalScore >= 70) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', bar: 'bg-blue-500', value: finalScore };
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', bar: 'bg-amber-500', value: finalScore };
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* 1. THANH TÌM KIẾM ĐẦU TRANG */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
              <Sparkles className="w-5 h-5 text-purple-500 ml-4 animate-pulse" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập kỹ năng, kinh nghiệm hoặc vị trí bạn muốn ứng tuyển bằng AI..."
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
              {initialQuery ? `Kết quả tìm kiếm phù hợp cho: "${initialQuery}"` : "Tất cả việc làm gợi ý từ AI"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Dữ liệu được đồng bộ trực tiếp từ hệ thống tuyển dụng</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-600 hover:bg-gray-50 transition">
            <SlidersHorizontal className="w-4 h-4" /> Bộ lọc
          </button>
        </div>

        {/* 2. HIỂN THỊ DANH SÁCH TIN TUYỂN DỤNG */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-40 w-full animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">Không tìm thấy công việc nào trên hệ thống hiện tại.</p>
            <p className="text-xs text-gray-400 mt-1">Hãy thử tìm kiếm với các từ khóa chuyên ngành khác như Java, SQL, React...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              // Khởi tạo hiển thị màu theo điểm tương đồng AI trả về
              const colors = getScoreColor(job.matchingScore);
              
              // Tách chuỗi kỹ năng "Java, Spring Boot" thành mảng các phần tử để render map()
              const tagsArray = job.skillsTags 
                ? job.skillsTags.split(',').map(tag => tag.trim()) 
                : [];

              return (
                <div 
                  key={job.id}
                  className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 relative group flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  {/* BÊN TRÁI: THÔNG TIN CHI TIẾT TIN TUYỂN DỤNG */}
                  <div className="space-y-2 flex-1">
                    <h3 
                      className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors cursor-pointer" 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Building2 className="w-4 h-4 text-gray-400" /> {job.companyName || "Công ty chưa cập nhật"}
                    </div>
                    
                    {/* Các thẻ thông tin nhanh */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-1">
                      <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location || "Toàn quốc"}</div>
                      <div className="flex items-center gap-1 font-semibold text-green-700">
                        <DollarSign className="w-3.5 h-3.5 text-green-600" /> {formatSalary(job.salaryMin, job.salaryMax)}
                      </div>
                    </div>

                    {/* Các thẻ từ khóa kỹ năng (Skills Tags) cắt từ chuỗi TEXT SQL */}
                    {tagsArray.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {tagsArray.map((tag, idx) => (
                          <span key={idx} className="bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-md text-xs font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* BÊN PHẢI: KHU VỰC ĐIỂM AI MATCHING */}
                  <div className="w-full md:w-48 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                    
                    {/* Khung hiển thị điểm số phần trăm AI */}
                    <div className={`px-3 py-1.5 rounded-xl border ${colors.bg} ${colors.text} ${colors.border} flex items-center gap-1 text-xs md:text-sm font-bold shadow-sm`}>
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      Hợp: {colors.value}%
                    </div>

                    {/* Thanh tiến trình hiển thị trực quan (Progress Bar) */}
                    <div className="w-24 bg-gray-100 rounded-full h-1.5 hidden md:block">
                      <div className={`h-1.5 rounded-full ${colors.bar}`} style={{ width: `${colors.value}%` }}></div>
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