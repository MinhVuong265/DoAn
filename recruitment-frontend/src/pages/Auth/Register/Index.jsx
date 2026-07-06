import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Building, Briefcase, Loader2 } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('CANDIDATE'); // CANDIDATE hoặc EMPLOYER
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Đóng gói dữ liệu khớp cấu trúc đối tượng nhận tin DTO phía Spring Boot
    const registrationData = { 
      fullName: fullName.trim(), 
      email: email.trim().toLowerCase(), 
      password: password, 
      role: accountType // Khớp với trường 'role' ENUM trong cấu trúc thực thể USERS
    };
    
    try {
      // Gọi API Endpoint xử lý đăng ký của Spring Boot thông qua Axios
      const response = await axios.post('http://localhost:8080/api/auth/register', registrationData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201 || response.status === 200) {
        // alert("Đăng ký tài khoản thành công! Hệ thống đang chuyển hướng sang trang đăng nhập.");
        navigate('/login');
      }
    } catch (error) {
      console.error("Lỗi trong quá trình kết nối API hệ thống:", error);
      // Xử lý thông điệp lỗi trả về từ Spring Boot (Ví dụ: Trùng email, lỗi định dạng mật khẩu...)
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại dịch vụ Backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gray-50/50">
      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 bg-purple-50 rounded-2xl text-purple-600 mb-2 border border-purple-100/50">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-gray-950 tracking-tight">Tạo tài khoản mới</h2>
          <p className="text-xs text-gray-400">Đăng ký để khám phá công nghệ phân tích hồ sơ thông minh.</p>
        </div>

        {/* LỰA CHỌN LOẠI TÀI KHOẢN (ỨNG VIÊN HOẶC NHÀ TUYỂN DỤNG) */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            disabled={loading}
            onClick={() => setAccountType('CANDIDATE')}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center gap-1.5 w-full ${
              accountType === 'CANDIDATE' ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span className="text-xs">Tìm Việc Làm</span>
          </button>
          <button 
            type="button"
            disabled={loading}
            onClick={() => setAccountType('EMPLOYER')}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center gap-1.5 w-full ${
              accountType === 'EMPLOYER' ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'
            }`}
          >
            <Building className="w-4 h-4" />
            <span className="text-xs">Tuyển Dụng</span>
          </button>
        </div>

        {/* HIỂN THỊ THÔNG BÁO LỖI NẾU CÓ */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">Họ và tên</label>
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-indigo-500 transition-all">
              <User className="w-4 h-4 text-gray-400 ml-4 absolute" />
              <input type="text" disabled={loading} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" required className="w-full py-2.5 pl-11 pr-4 bg-transparent text-xs text-gray-800 font-medium focus:outline-none disabled:opacity-60" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">Địa chỉ Email</label>
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-indigo-500 transition-all">
              <Mail className="w-4 h-4 text-gray-400 ml-4 absolute" />
              <input type="email" disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" required className="w-full py-2.5 pl-11 pr-4 bg-transparent text-xs text-gray-800 font-medium focus:outline-none disabled:opacity-60" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">Mật khẩu bảo mật</label>
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-indigo-500 transition-all">
              <Lock className="w-4 h-4 text-gray-400 ml-4 absolute" />
              <input type="password" disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" minLength={6} required className="w-full py-2.5 pl-11 pr-4 bg-transparent text-xs text-gray-800 font-medium focus:outline-none disabled:opacity-60" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                ĐANG XỬ LÝ...
              </>
            ) : (
              'ĐĂNG KÝ TÀI KHOẢN'
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Đã có tài khoản?{' '}
            <span onClick={() => !loading && navigate('/login')} className="text-indigo-600 font-bold hover:underline cursor-pointer">
              Đăng nhập tại đây
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;