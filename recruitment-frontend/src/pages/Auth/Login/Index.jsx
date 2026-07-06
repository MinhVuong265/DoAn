import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CANDIDATE'); // Gửi kèm vai trò lên backend nếu cần lọc
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Gọi trực tiếp lên API Đăng nhập của Backend Spring Boot
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        }),
      });

      if (!response.ok) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
      }

      // 2. Nhận dữ liệu JSON thật trả về từ LoginResponse DTO
      const data = await response.json(); 
      // Cấu trúc data: { id, token, email, role, active }

      // 3. Lưu Token và thông tin thật vào LocalStorage để các trang khác sử dụng bảo mật
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("fullName", data.fullName);
      localStorage.setItem("isLoggedIn", "true");

      // alert(`Đăng nhập thành công! Chào mừng quay trở lại.`);

      // 4. Điều hướng trang dựa trên vai trò THẬT trả về từ cơ sở dữ liệu
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else if (data.role === 'EMPLOYER') {
        navigate('/employer');
      } else {
        navigate('/');
      }

      // Tải lại trang nhẹ để thanh Menu chính cập nhật lại quyền mới
      window.location.reload();

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setErrorMsg(error.message || 'Không thể kết nối đến máy chủ backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gray-50/50">
      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        
        {/* TIÊU ĐỀ KHỐI */}
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 bg-indigo-50 rounded-2xl text-indigo-600 mb-2 border border-indigo-100/50">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-gray-950 tracking-tight">Chào mừng bạn trở lại</h2>
          <p className="text-xs text-gray-400">Đăng nhập để kết nối với hệ thống việc làm trí tuệ nhân tạo.</p>
        </div>

        {/* THÔNG BÁO LỖI NẾU CÓ */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* FORM NHẬP THÔNG TIN */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">Địa chỉ Email</label>
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-indigo-500 transition-all">
              <Mail className="w-4 h-4 text-gray-400 ml-4 absolute" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@company.com" 
                required 
                disabled={loading}
                className="w-full py-2.5 pl-11 pr-4 bg-transparent text-xs text-gray-800 font-medium focus:outline-none" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">Mật khẩu</label>
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-indigo-500 transition-all">
              <Lock className="w-4 h-4 text-gray-400 ml-4 absolute" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                disabled={loading}
                className="w-full py-2.5 pl-11 pr-4 bg-transparent text-xs text-gray-800 font-medium focus:outline-none" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" /> {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP NGAY'}
          </button>
        </form>

        {/* LINK CHUYỂN SANG ĐĂNG KÝ */}
        <div className="text-center pt-2 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Chưa có tài khoản hệ thống?{' '}
            <span onClick={() => navigate('/register')} className="text-indigo-600 font-bold hover:underline cursor-pointer">
              Đăng ký tài khoản mới
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;