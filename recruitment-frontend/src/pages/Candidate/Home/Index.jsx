import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Cpu, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import ChatWindow from '../../../components/chatbot/ChatWindow';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  // Hàm xử lý khi ứng viên nhập câu lệnh và nhấn nút "AI Search" từ SearchBar
  const handleSearchSubmit = () => {
      if (searchQuery.trim()) {
          navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
          navigate("/jobs");
      }
  };

  // Mảng dữ liệu chứa các chỉ số ấn tượng để làm đẹp giao diện (Thống kê ảo/thực của hệ thống)
  const features = [
    {
      icon: <Briefcase className="w-6 h-6 text-purple-600" />,
      title: "10,000+ Việc làm",
      desc: "Tin tuyển dụng chất lượng cao cập nhật hàng ngày từ các doanh nghiệp uy tín."
    },
    {
      icon: <Cpu className="w-6 h-6 text-indigo-600" />,
      title: "Sàng lọc CV bằng AI",
      desc: "Hệ thống tự động phân tích và trích xuất kỹ năng từ hồ sơ của bạn một cách thông minh."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Kết nối trực tiếp",
      desc: "Trò chuyện trực tiếp với nhà tuyển dụng thông qua trợ lý ảo Chatbot thông minh."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white pb-16">
      
      {/* 1. HERO SECTION (Khu vực Banner chào mừng ở trung tâm trang chủ) */}
      <div className="max-w-5xl mx-auto pt-16 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6 animate-fade-in">
          <ShieldCheck className="w-4 h-4" />
          Nền tảng tuyển dụng tích hợp Trí tuệ nhân tạo (AI) Thế hệ mới
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Tìm kiếm công việc mơ ước bằng <br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Sức mạnh của AI Ngữ Nghĩa
          </span>
        </h1>
        
        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
          Vượt qua giới hạn của tìm kiếm từ khóa truyền thống. Hãy nói cho AI biết thế mạnh, dự án cá nhân hoặc mong muốn của bạn bằng ngôn ngữ tự nhiên, hệ thống sẽ tự động tìm việc phù hợp nhất.
        </p>

        {/* Nhúng Component Thanh tìm kiếm thông minh đã code ở bước trước vào đây */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/jobs")}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                      bg-gradient-to-r from-purple-600 to-indigo-600
                      hover:from-purple-700 hover:to-indigo-700
                      text-white font-semibold text-lg
                      shadow-lg hover:shadow-xl
                      transition-all duration-300
                      hover:-translate-y-0.5 active:scale-95"
          >
            <Briefcase className="w-5 h-5" />
            Khám phá việc làm
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>

      {/* 2. CHOOSE CV QUICK LINK (Khu vực gợi ý tải CV để AI phân tích ngay tại trang chủ) */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold">Bạn đã có sẵn CV cá nhân (PDF)?</h3>
            <p className="text-purple-200 text-sm mt-1 max-w-md">
              Hãy tải lên để hệ thống RAG tự động học hồ sơ của bạn, giúp Chatbot hỗ trợ tư vấn việc làm chính xác hơn 200%.
            </p>
          </div>
          <button 
            onClick={() => navigate('/profile')} 
            className="px-6 py-3 bg-white hover:bg-purple-50 text-purple-900 font-semibold rounded-xl shadow-md transition-all whitespace-nowrap active:scale-95"
          >
            Tải CV lên ngay 🚀
          </button>
        </div>
      </div>

      {/* 3. FEATURES SECTION (Khu vực hiển thị các tính năng nổi bật của đồ án) */}
      <div className="max-w-6xl mx-auto px-4 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Điểm khác biệt của hệ thống
          </h2>
          <div className="w-12 h-1 bg-purple-600 mx-auto mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-5 border border-gray-100">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Home;