import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, User, Mail, Calendar } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// const navigate = useNavigate();
const JobApplicantsList = ()=>{
  const {jobId}=useParams();

  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      const res = await axios.get(`http://localhost:8080/api/jobs/${jobId}/applicants`);
      
      setApplicants(res.data);
    };
    fetchApplicants();
  }, [jobId]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl max-w-4xl mx-auto mt-8">
      <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" /> 
        Danh sách ứng viên đã nộp đơn (AI Chấm Điểm Tự Động)
      </h2>

      <div className="space-y-4">
        {applicants.map((app, index) => (
          <div key={index} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-gray-800">{app.full_name}</span>
                <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        app.matchingscore >= 85
                            ? "bg-emerald-100 text-emerald-700"
                            : app.matchingscore >= 70
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                    }`}
                >
                    AI Match: {Number(app.matchingscore).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {app.email}</p>
              <p className="text-xs text-gray-400 font-medium">💡 Kỹ năng: {app.skills || "Chưa cập nhật"}</p>
              <p className="text-xs text-gray-500 italic">
                  {app.summary}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
            <button
                onClick={() => navigate(`/employer/cv/${app.cvid}`)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all">
                Xem chi tiết CV
            </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all">
                Duyệt gọi phỏng vấn
              </button>
            </div>
          </div>
        ))}

        {applicants.length === 0 && (
          <p className="text-center text-xs text-gray-400 italic py-6">Chưa có ứng viên nào nộp hồ sơ vào vị trí này.</p>
        )}
      </div>
    </div>
  );
};

export default JobApplicantsList;