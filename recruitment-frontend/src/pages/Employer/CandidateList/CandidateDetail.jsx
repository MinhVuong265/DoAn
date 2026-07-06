import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  User, 
  FileText,
  Award,
  AlertCircle
} from 'lucide-react';

const CandidateCvDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

    const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notes, setNotes] = useState("");
  const [actionSuccess, setActionSuccess] = useState(null);

    const { cvId } = useParams();

    useEffect(() => {
        const fetchCV = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    `http://localhost:8080/api/cv/${cvId}`
                );

                setCv(response.data);
            } catch (err) {
                console.error(err);
                setError("Không tải được hồ sơ.");
            } finally {
                setLoading(false);
            }
        };

        fetchCV();
    }, [cvId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-100 border-t-indigo-600 mx-auto"></div>
          <p className="text-sm text-gray-500 font-medium">Đang truy xuất hồ sơ và đồng bộ hóa phân tích AI...</p>
        </div>
      </div>
    );
  }

  if (error || !cv) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl max-w-md text-center space-y-4">
          <p className="text-red-500 font-semibold">{error || "Không tìm thấy hồ sơ ứng tuyển này."}</p>
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition">
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }


    const skillsList = cv.skills
        ? cv.skills.split(",").map(s => s.trim())
        : [];

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* THANH ĐIỀU HƯỚNG QUAY LẠI */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> QUAY LẠI DANH SÁCH ỨNG VIÊN
        </button>

        {/* 1. KHỐI THÔNG TIN CHUNG VÀ TÁC VỤ NHANH */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-4 items-start">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-black text-gray-950">{cv.fullName || "Chưa cập nhật tên"}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold">
                    Hồ sơ CV
                </span>

                <span className="text-[10px] text-gray-400">
                    Cập nhật: {new Date(cv.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>

          {/* <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            {cv?.fileName && (
              <a 
                href={`http://localhost:8080/api/cv/download/${cv.id}`}
                className="flex-1 md:flex-none px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-gray-200 transition"
                target="_blank"
                rel="noreferrer"
              >
                <Download className="w-4 h-4" /> TẢI FILE GỐC
              </a>
            )}
          </div> */}
        </div>

        {/* 2. CHIA BỐ CỤC: BÊN TRÁI HỒ SƠ - BÊN PHẢI AI ASSESSMENT & ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CỘT TRÁI: CHI TIẾT CV (CHIẾM 2 PHẦN) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* THÔNG TIN LIÊN HỆ */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-50">Thông tin liên hệ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-2.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span>Email: <strong className="text-gray-800">{cv.email || "Chưa có"}</strong></span>
                </div>
                <div className="flex items-center gap-2.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  <span>SĐT: <strong className="text-gray-800">{cv.phone || "Chưa có"}</strong></span>
                </div>
                <div className="flex items-center gap-2.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>Địa chỉ: <strong className="text-gray-800">{cv.address || "Chưa cập nhật"}</strong></span>
                </div>
              </div>
            </div>

            {/* KINH NGHIỆM LÀM VIỆC */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-gray-950 uppercase">Kinh nghiệm làm việc</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line text-justify">
                {cv.experience || "Chưa cập nhật chi tiết kinh nghiệm."}
              </p>
            </div>

            {/* HỌC VẤN / ĐÀO TẠO */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-gray-950 uppercase">Học vấn & Bằng cấp</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line text-justify">
                {cv.education || "Chưa cập nhật thông tin học vấn."}
              </p>
            </div>

          </div>

          {/* CỘT PHẢI: AI MATCHING & PANEL PHÊ DUYỆT */}
          <div className="space-y-6">
            
            {/* KHỐI AI MATCHING */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <h3 className="text-xs font-black text-purple-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-pulse" /> Sàng lọc bằng AI
                </h3>
                <span className="bg-purple-50 text-purple-600 text-[9px] font-black px-2 py-0.5 rounded border border-purple-100">
                  COSINE MATCH
                </span>
              </div>
              
              {/* LIST KỸ NĂNG CỦA ỨNG VIÊN */}
              {skillsList.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Kỹ năng trích xuất được</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsList.map((skill, index) => (
                      <span key={index} className="bg-indigo-50/50 text-indigo-600 border border-indigo-100 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            

             

             

          </div>

        </div>

      </div>
    </div>
  );
};

export default CandidateCvDetails;