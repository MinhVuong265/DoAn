import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, FileText, CheckCircle, X, Sparkles } from 'lucide-react';
import CVUploader from './CVUploader'; // Đảm bảo import đúng đường dẫn file uploader của em

const Profile = () => {
  const userId = localStorage.getItem('userId');

  const [formData, setFormData] = useState({
    fullName: '', email: '', phoneNumber: '', avatarUrl: '',
    githubUrl: '', linkedinUrl: '', summary: '', experience: '',
    education: '', skillsTags: '', cvUrl: ''
  });

  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAiFilled, setIsAiFilled] = useState(false);

  // 1. Tự động tải dữ liệu cũ (nếu có) khi load trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/candidate/profile/${userId}`);
        if (response.data) {
          setFormData(response.data);
          if (response.data.cvUrl) {
            setUploadedFileName("Hồ sơ gốc đính kèm trên hệ thống");
          }
        }
      } catch (err) {
        console.log("Chưa có profile cũ hoặc lỗi kết nối. Người dùng sẽ tạo mới.");
      }
    };
    fetchProfile();
  }, [userId]);

  // 2. Hàm callback tiếp nhận dữ liệu sau khi AI bóc tách từ file CV thành công
  const handleAiUploadSuccess = (file, parsedData) => {
    setUploadedFileName(file.name);
    setIsAiFilled(true);

    // Điền tự động dữ liệu AI phân tích được vào Form state
    setFormData(prev => ({
      ...prev,
      fullName: parsedData.fullName || prev.fullName,
      email: parsedData.email || prev.email,
      phoneNumber: parsedData.phone || prev.phoneNumber,
      // Chuyển mảng kỹ năng thành chuỗi ngăn cách bằng dấu phẩy
      skillsTags: parsedData.skills ? parsedData.skills.join(', ') : prev.skillsTags,
      summary: parsedData.experience ? `Tóm tắt năng lực bóc tách từ CV. \n` : prev.summary,
      experience: parsedData.experience || prev.experience,
      education: parsedData.education || prev.education,
      cvUrl: "http://localhost:8080/uploads/cv/" + file.name // Trong thực tế lấy đường dẫn trả về từ BE
    }));

    // Tự động tắt thông báo badge AI sau 5 giây
    setTimeout(() => setIsAiFilled(false), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveFile = () => {
    setUploadedFileName('');
    setFormData(prev => ({ ...prev, cvUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    try {
      await axios.put(`http://localhost:8080/api/candidate/profile/${userId}/update`, formData);
      setSuccess(true);
    } catch (err) {
      console.error("Lỗi cập nhật hồ sơ cá nhân:", err);
      alert("Cập nhật hồ sơ thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
        
        {/* TIÊU ĐỀ TRANG */}
        <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-6">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Hồ Sơ Năng Lực Cá Nhân (AI Profile)</h1>
            <p className="text-xs text-gray-400 mt-0.5">Tải hồ sơ CV của bạn lên để AI tự động điền form và đồng bộ thông tin tuyển dụng.</p>
          </div>
        </div>

        {/* THÔNG BÁO THÀNH CÔNG */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-2 border border-emerald-100 text-sm font-semibold">
            <CheckCircle className="w-5 h-5" /> Lưu thông tin và làm mới cấu trúc Vector AI thành công!
          </div>
        )}

        {/* THÔNG BÁO ĐÃ ĐỔ DỮ LIỆU TỪ AI */}
        {isAiFilled && (
          <div className="mb-6 p-4 bg-purple-50 text-purple-700 rounded-2xl flex items-center gap-2 border border-purple-100 text-xs font-bold animate-pulse">
            <Sparkles className="w-4 h-4 shrink-0" /> Trí tuệ nhân tạo (LLM) đã bóc tách dữ liệu từ file CV thành công và tự động điền vào Form dưới đây!
          </div>
        )}

        {/* 📥 KHU VỰC TÍCH HỢP CV UPLOADER COMPONENT */}
        <div className="mb-8">
          {!formData.cvUrl ? (
            <CVUploader onUploadSuccess={handleAiUploadSuccess} />
          ) : (
            <div className="max-w-2xl mx-auto p-4 bg-purple-50/40 border border-purple-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-gray-800 truncate">{uploadedFileName}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Mô hình AI đã ánh xạ dữ liệu thành công</p>
                </div>
              </div>
              <button type="button" onClick={handleRemoveFile} className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-red-500 rounded-lg transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* THÔNG TIN FORM CHI TIẾT */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Họ và tên</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Địa chỉ Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-purple-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Số điện thoại</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Đường dẫn GitHub</label>
              <input type="text" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/..." className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Đường dẫn LinkedIn</label>
              <input type="text" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-purple-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Từ khóa thế mạnh / Kỹ năng (Mô hình AI phân tích)</label>
            <input type="text" name="skillsTags" value={formData.skillsTags} onChange={handleChange} placeholder="Ví dụ: Java, Python, ReactJS, Docker, AWS" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-purple-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tóm tắt giới thiệu bản thân</label>
            <textarea name="summary" rows="3" value={formData.summary} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-purple-500"></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kinh nghiệm làm việc</label>
            <textarea name="experience" rows="5" value={formData.experience} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-purple-500"></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Học vấn & Bằng cấp</label>
            <textarea name="education" rows="3" value={formData.education} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-purple-500"></textarea>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50">
            {isLoading ? "Hệ thống đang lưu trữ và đồng bộ Profile..." : "XÁC NHẬN LƯU VÀ ĐỒNG BỘ HỒ SƠ"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Profile;