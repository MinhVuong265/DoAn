

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
//Inport Auth
import Login from './pages/Auth/Login/Index';
import Register from './pages/Auth/Register/Index';

// Import các trang phía Ứng viên (Candidate)
import CandidateHome from './pages/Candidate/Home/Index';
import JobList from './pages/Candidate/JobList/Index';
import JobDetails from './pages/Candidate/JobDetails/Index';
import Profile from './pages/Candidate/Profile/Index';

// Import các trang phía Nhà tuyển dụng (Employer)
import EmployerDashboard from './pages/Employer/Dashboard/Index';
import JobPost from './pages/Employer/JobPost/Index';
import JobDetailsEmployer from './pages/Employer/JobDetails/Index';
import CandidateList from './pages/Employer/CandidateList/Index';
import JobListEmployer from './pages/Employer/JobList'; // Import trang danh sách ứng viên cho Job
import CandidateDetails from './pages/Employer/CandidateList/CandidateDetail'; // Import trang chi tiết ứng viên

// Import các trang Admin
import AdminDashboard from './pages/Admin/Dashboard/Index';
import AdminKnowledge from './pages/Admin/Knowledge/Index';

// Import Chatbot toàn cục
import ChatBubble from './components/chatbot/ChatBubble';

import Chatbot from './components/chatbot/Chatbot';

function App() {
  // Đọc trạng thái lưu trữ của User từ LocalStorage để phân phối hiển thị giao diện
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole') || 'GUEST'; // CANDIDATE, EMPLOYER, ADMIN, GUEST

  const handleLogout = () => {
    localStorage.clear();
    alert("Đã đăng xuất khỏi hệ thống!");
    window.location.href = '/login';
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

    <Router>
      
      <div className="relative min-h-screen bg-gray-50/50">
        
        {/* THANH ĐIỀU HƯỚNG PHÂN QUYỀN ĐỘNG (ROLES NAVBAR) */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap gap-4 items-center justify-between shadow-xs sticky top-0 z-40 text-xs font-bold">
          <div className="flex gap-2 text-purple-700 items-center text-sm font-black cursor-pointer" onClick={() => window.location.href = '/'}>
            <span>✨ RECRUITMENT AI</span>
            {isLoggedIn && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Role: {userRole}</span>}
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            {/* 1. NẾU LÀ GUEST (CHƯA ĐĂNG NHẬP): CHỈ HIỂN THỊ LINK TRANG CHỦ + NÚT AUTH */}
            {!isLoggedIn && (
              <>
                <a href="/" className="px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition">Trang chủ</a>
                <a href="/login" className="px-4 py-2 rounded-xl bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 transition">Đăng nhập</a>
                <a href="/register" className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Đăng ký</a>
              </>
            )}

            {/* 2. NẾU ĐÃ ĐĂNG NHẬP VỚI QUYỀN ỨNG VIÊN (CANDIDATE) */}
            {isLoggedIn && userRole === 'CANDIDATE' && (
              <div className="flex gap-2 bg-purple-50 p-1 rounded-xl border border-purple-100">
                <a href="/" className="px-3 py-1.5 rounded-lg hover:bg-white text-purple-700 transition">Trang chủ</a>
                <a href="/jobs" className="px-3 py-1.5 rounded-lg hover:bg-white text-purple-700 transition">Tìm việc làm</a>
                <a href="/profile" className="px-3 py-1.5 rounded-lg hover:bg-white text-purple-700 transition">Hồ sơ CV</a>
              </div>
            )}

            {/* 3. NẾU ĐÃ ĐĂNG NHẬP VỚI QUYỀN NHÀ TUYỂN DỤNG (EMPLOYER) */}
            {isLoggedIn && userRole === 'EMPLOYER' && (
              <div className="flex gap-2 bg-indigo-50 p-1 rounded-xl border border-indigo-100">
                <a href="/employer" className="px-3 py-1.5 rounded-lg hover:bg-white text-indigo-700 transition">Bảng thống kê</a>
                <a href="/employer/post" className="px-3 py-1.5 rounded-lg hover:bg-white text-indigo-700 transition">Đăng bài JD</a>
                <a href="/employer/jobs" className="px-3 py-1.5 rounded-lg hover:bg-white text-indigo-700 transition">Bài đăng</a>
              </div>
            )}

            {/* 4. NẾU ĐÃ ĐĂNG NHẬP VỚI QUYỀN QUẢN TRỊ VIÊN (ADMIN) */}
            {isLoggedIn && userRole === 'ADMIN' && (
              <div className="flex gap-2 bg-red-50 p-1 rounded-xl border border-red-100">
                <a href="/admin" className="px-3 py-1.5 rounded-lg hover:bg-white text-red-700 transition">AI Monitor Console</a>
                <a href="/admin/knowledge" className="px-3 py-1.5 rounded-lg hover:bg-white text-red-700 transition">Kho RAG Hub</a>
              </div>
            )}

            {/* NÚT ĐĂNG XUẤT CHUNG */}
            {isLoggedIn && (
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition ml-2">
                Đăng xuất
              </button>
            )}
          </div>
        </nav>

        {/* QUẢN LÝ TUYẾN ĐƯỜNG ROUTING */}
        <div className="container mx-auto">
          <Routes>
            <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/" />} />

            {/* Bảo vệ các tuyến đường theo phân quyền (Nếu chưa đăng nhập đúng role, đá về login) */}
            <Route path="/" element={ isLoggedIn && userRole === 'CANDIDATE' ? <Navigate to="/candidate" /> : <Navigate to="/employer" /> } />
            <Route path="/jobs" element={isLoggedIn && userRole === 'CANDIDATE' ? <JobList /> : <Navigate to="/login" />} />
            {/* <Route path="/jobs" element={<JobList />} /> */}
            <Route path="/profile" element={isLoggedIn && userRole === 'CANDIDATE' ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            
            {/* Đường dẫn của Nhà tuyển dụng */}
            
            <Route path="/employer" element={isLoggedIn && userRole === 'EMPLOYER' ? <EmployerDashboard /> : <Navigate to="/login" />} />
            <Route path="/employer/post" element={isLoggedIn && userRole === 'EMPLOYER' ? <JobPost /> : <Navigate to="/login" />} />
            <Route path="/employer/candidates" element={isLoggedIn && userRole === 'EMPLOYER' ? <CandidateList /> : <Navigate to="/login" />} />
            <Route path="/employer/job-post" element={<JobPost />} />
            <Route path="/employer/jobs/:id" element={<JobDetailsEmployer />} />
            <Route path="/employer/jobs" element={<JobListEmployer/>}/>
            <Route path="/employer/cv/:cvId" element={<CandidateDetails />}/>
            {/* <Route path="/employer/jobs/:jobId/applications" element={<CandidateList/>}/> */}
            
            {/* Đường dẫn của Ứng viên / Khách */}
            <Route path="/candidate/profile" element={<Profile />} />
            <Route path="/candidate" element={<CandidateHome />} />
            {/* <Route path="/jobs/search" element={<JobSearch />} /> */}



            <Route path="/admin" element={isLoggedIn && userRole === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/admin/knowledge" element={isLoggedIn && userRole === 'ADMIN' ? <AdminKnowledge /> : <Navigate to="/login" />} />

            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Routes>
          <Chatbot />
        </div>
        
      </div>
    </Router>
    </>
  );
  const getHomeByRole = () => {
    if (!isLoggedIn) return "/";

    switch (userRole) {
        case "CANDIDATE":
            return "/candidate";

        case "EMPLOYER":
            return "/employer";

        case "ADMIN":
            return "/admin";

        default:
            return "/";
    }
};
}

export default App;