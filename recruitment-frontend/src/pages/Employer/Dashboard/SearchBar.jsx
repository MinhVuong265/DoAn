import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar'; // Đảm bảo đúng đường dẫn file của em

const EmployerSearchBar = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm xử lý liên kết gọi API đập về Spring Boot
  const handleSemanticSearch = async (description) => {
      setIsLoading(true);
      setError(null);
      try {
        // Endpoint sửa thành /api/search/candidates vì đây là tìm kiếm ứng viên/CV cho Employer
        const response = await axios.get(`http://localhost:8080/api/search/candidates`, {
          params: { 
            description: description, // Gửi mô tả công việc (jobDescription) lên server
            limit: 5 
          }
        });
        
        // Dữ liệu trả về sẽ là danh sách các ứng viên phù hợp
        setSearchResults(response.data);
      } catch (err) {
        console.error("Lỗi tìm kiếm ứng viên ngữ nghĩa:", err);
        setError("Không thể kết nối đến máy chủ hoặc phiên tìm kiếm AI bị quá tải.");
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Tiêu đề trang */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Hệ Thống Săn Nhân Sự Thông Minh
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Tìm kiếm ứng viên tài năng thông qua sức mạnh của trí tuệ nhân tạo (AI RAG)
          </p>
        </div>

        {/* 1. Nhúng SearchBar của em và truyền hàm handleSemanticSearch qua prop onSearchSubmit */}
        <SearchBar onSearchSubmit={handleSemanticSearch} />

        {/* 2. Trạng thái Loading lấp lánh kiểu AI */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center mt-12 gap-3">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-purple-600 font-medium animate-pulse">AI đang phân tích ngữ nghĩa và quét kho dữ liệu CV...</p>
          </div>
        )}

        {/* 3. Hiển thị thông báo lỗi nếu có */}
        {error && (
          <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm shadow-sm border border-red-100">
            {error}
          </div>
        )}

        {/* 4. Đổ dữ liệu kết quả CV tìm kiếm được */}
        {!isLoading && searchResults.length > 0 && (
          <div className="mt-10 px-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🎯 Kết quả tìm kiếm phù hợp nhất ({searchResults.length})
            </h3>
            
            <div className="space-y-4">
              {searchResults.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Hiển thị điểm số phần trăm tương đồng (similarity) từ RPC match_cvs */}
                  <div className="absolute right-4 top-4 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    Khớp: {item.similarity ? (item.similarity * 100).toFixed(1) : 0}%
                  </div>

                  <h4 className="text-md font-bold text-indigo-700 mb-2">
                    Mã ứng viên (CV ID): #{item.cv_id}
                  </h4>
                  
                  {/* Nội dung CV được AI bóc tách rút gọn */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 bg-gray-50 p-3 rounded-xl border border-gray-50">
                    {item.content}
                  </p>
                  
                  <div className="mt-4 flex justify-end">
                    <button className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 transition-all">
                      Xem chi tiết hồ sơ gốc &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Trạng thái tìm kiếm không thấy kết quả */}
        {!isLoading && searchResults.length === 0 && !error && (
          <div className="text-center text-sm text-gray-400 mt-16 italic">
            Nhập câu lệnh tuyển dụng ở trên để AI gợi ý ứng viên chính xác nhất.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerSearchBar;