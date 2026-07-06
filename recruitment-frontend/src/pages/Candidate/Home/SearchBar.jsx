import React, { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';

// Thêm prop customPlaceholders và buttonText để tùy biến giao diện bên ngoài
const SearchBar = ({ onSearchSubmit, customPlaceholders, buttonText = "Tìm kiếm" }) => {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Danh sách mặc định hướng tới việc tìm JOB (Dành cho Ứng viên / Khách vãng lai)
  const defaultPlaceholders = [
    "Tìm việc Frontend lương trên 15 triệu ở Hà Nội...",
    "Tôi biết lập trình Java và MySQL, có công việc nào hợp không?...",
    "Tìm việc làm từ xa (Remote) phúc lợi tốt cho Intern...",
    "Tuyển dụng kỹ sư AI làm việc tại TP. Hồ Chí Minh..."
  ];

  // Chọn danh sách hiển thị: nếu có prop truyền vào thì dùng, không thì dùng mặc định tìm job
  const placeholders = customPlaceholders || defaultPlaceholders;

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [placeholders]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && onSearchSubmit) {
      onSearchSubmit(query);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-gray-100 hover:border-purple-300 transition-all duration-300 group focus-within:ring-2 focus-within:ring-purple-500/20">
          
          <div className="pl-5 text-purple-500">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholders[placeholderIndex]}
            className="w-full py-4 pl-3 pr-32 text-gray-700 bg-transparent rounded-2xl focus:outline-none text-base md:text-lg transition-all"
          />

          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">{buttonText}</span>
          </button>
        </div>
      </form>
      
      <p className="text-center text-xs text-gray-400 mt-3 italic">
        * Hệ thống sử dụng công nghệ Tìm kiếm ngữ nghĩa (Semantic Search). Bạn có thể nhập thế mạnh bản thân hoặc mô tả công việc mong muốn.
      </p>
    </div>
  );
};

export default SearchBar;