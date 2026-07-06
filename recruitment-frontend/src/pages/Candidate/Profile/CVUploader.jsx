import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Sparkles, AlertCircle } from 'lucide-react';

const CVUploader = ({ onUploadSuccess }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Xử lý hiệu ứng khi người dùng kéo file vào vùng drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // HÀM GỌI API THỰC TẾ GỬI FILE PDF SANG BACKEND
  const processCVWithAI = async (file) => {
    // 1. Kiểm tra định dạng file phía Client để tránh gửi yêu cầu rác
    if (file.type !== "application/pdf") {
      setError("Hệ thống AI hiện tại tối ưu tốt nhất cho định dạng file (.pdf). Vui lòng thử lại.");
      return;
    }

    // Kiểm tra dung lượng file (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setError("Dung lượng file vượt quá giới hạn 5MB. Vui lòng nén file hoặc chọn file khác.");
      return;
    }

    setError('');
    setIsProcessing(true);

    // 2. Khởi tạo đối tượng FormData để đóng gói file gửi qua HTTP Post
    const formData = new FormData();
    formData.append('file', file);
    formData.append("userId", localStorage.getItem("userId"));
    try {
      // 3. Thực hiện lệnh gọi tới API Spring Boot Backend của em
      const response = await axios.post('http://localhost:8080/api/cv/parse', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ép định dạng header gửi file
        },
      });

      // 4. Kiểm tra cấu trúc dữ liệu trả về từ Backend
      // Giả sử Spring Boot trả về object chứa cả cvUrl và thông tin đã bóc tách:
      // data: { cvUrl: "...", parsedData: { fullName: "...", skills: [...], ... } }
      if (response.data) {
        const serverData = response.data.parsedData || response.data;
        
        // Trả ngược kết quả thật về cho Component cha (CandidateProfileForm)
        onUploadSuccess(file, serverData);
      }
    } catch (err) {
      console.error("Lỗi kết nối hoặc xử lý API từ hệ thống:", err);
      // Hiển thị thông báo lỗi chi tiết tùy thuộc vào phản hồi từ server
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Lỗi từ hệ thống: ${err.response.data.message}`);
      } else {
        setError("Không thể kết nối tới server Backend hoặc mô hình AI đang bận. Vui lòng thử lại.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processCVWithAI(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processCVWithAI(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* VÙNG KÉO THẢ FILE CV */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-3 border-dashed rounded-3xl p-10 text-center transition-all duration-300 relative ${
          isDragActive 
            ? 'border-purple-500 bg-purple-50/50 scale-[1.01]' 
            : 'border-gray-200 bg-white hover:border-purple-400 hover:bg-gray-50/30'
        } ${isProcessing ? 'pointer-events-none' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          id="cv-file-input"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        {isProcessing ? (
          /* TRẠNG THÁI AI ĐANG XỬ LÝ (PROCESSING STATE) */
          <div className="space-y-4 py-6">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-100 border-t-purple-600"></div>
              <Sparkles className="w-6 h-6 text-purple-600 absolute animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Mô hình AI đang đọc dữ liệu CV...</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                Hệ thống đang bóc tách thông tin cá nhân, định danh kỹ năng (NER) và cấu trúc lại hồ sơ của bạn.
              </p>
            </div>
          </div>
        ) : (
          /* TRẠNG THÁI CHỜ TẢI FILE (DEFAULT STATE) */
          <label htmlFor="cv-file-input" className="cursor-pointer block space-y-4 py-4">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">Kéo và thả file CV của bạn vào đây</p>
              <p className="text-sm text-gray-400 mt-1">hoặc <span className="text-purple-600 font-semibold hover:underline">Duyệt file từ máy tính</span></p>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2 font-medium">
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Hỗ trợ định dạng: PDF</span>
              <span>•</span>
              <span>Dung lượng tối đa: 5MB</span>
            </div>
          </label>
        )}
      </div>

      {/* THÔNG BÁO LỖI NẾU SAI ĐỊNH DẠNG HOẶC LỖI API */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};

export default CVUploader;