import React from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Database, 
  Activity, 
  Server, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

const AdminDashboard = () => {
  // Giả lập các thông số tài nguyên hệ thống AI hiện tại
  const aiSystemStats = [
    { id: 1, name: 'Tổng số lượt gọi API LLM', value: '45,280', subtitle: 'Trong tháng này', icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, name: 'Số lượng Vectors lưu trữ', value: '1,204,500', subtitle: 'Hóa Vector từ JD và CV', icon: Database, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 3, name: 'Thời gian phản hồi RAG TB', value: '1.24 giây', subtitle: 'Độ trễ xử lý Embedding + Gen', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 4, name: 'Tỷ lệ phản hồi chính xác', value: '94.8%', subtitle: 'Do người dùng đánh giá tốt', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  // Giả lập log hoạt động thời gian thực của hệ thống AI (AI System Logs)
  const realTimeLogs = [
    { id: 1, time: '16:14:02', type: 'success', message: 'Hóa Vector (Embedding) thành công CV_NguyenVanA.pdf (6 Chunks).' },
    { id: 2, time: '16:11:45', type: 'info', message: 'Chatbot RAG: Trả lời câu hỏi ứng viên thành công qua Gemini API (Tokens: 342).' },
    { id: 3, time: '15:58:20', type: 'success', message: 'Thực hiện tái lập chỉ mục (Re-indexing) 12 bài đăng tuyển dụng mới vào Vector DB.' },
    { id: 4, time: '15:30:12', type: 'warning', message: 'Cảnh báo: Tốc độ gọi API OpenAI tiệm cận ngưỡng giới hạn Rate-limit (82%).' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* TIÊU ĐỀ HEADER CHUYÊN NGHIỆP */}
        <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="p-3 bg-red-50 rounded-xl text-red-600 border border-red-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-950">Hệ thống Quản trị - AI Control Panel</h1>
            <p className="text-xs text-gray-400 mt-0.5">Giám sát tài nguyên phần cứng, dữ liệu Vector và kiểm soát luồng mô hình trí tuệ nhân tạo.</p>
          </div>
        </div>

        {/* 1. KHỐI HIỂN THỊ CÁC CHỈ SỐ AI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiSystemStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{stat.name}</span>
                  <div className={`p-2 rounded-xl border border-gray-100 ${stat.bg} ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                  <p className="text-[10px] font-medium text-gray-400 mt-0.5">{stat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. PHẦN CHIA HAI KHỐI: MONITORING ĐỒ THỊ GIẢ LẬP & SYSTEM LOGS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* BÊN TRÁI (CHIẾM 7 CỘT): TRẠNG THÁI CLUSTER VÀ INFRASTRUCTURE */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Server className="w-4 h-4 text-gray-500" /> Cấu hình dịch vụ AI Gateway
            </h3>

            <div className="space-y-4">
              {/* Mô hình LLM Core chính */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800">Mô hình LLM Core chính (RAG & Parsing)</p>
                  <p className="text-xs text-gray-400 mt-0.5">Cổng kết nối: Google Gemini Pro API / OpenAI GPT-4o</p>
                </div>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold uppercase">
                  Connected
                </span>
              </div>

              {/* Vector Database Status */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800">Cơ sở dữ liệu Vector (Vector DB)</p>
                  <p className="text-xs text-gray-400 mt-0.5">Cấu hình: Milvus v2.4 / PGVector (Khoảng cách: Cosine Similarity)</p>
                </div>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold uppercase">
                  Active (0ms)
                </span>
              </div>
            </div>
          </div>

          {/* BÊN PHẢI (CHIẾM 5 CỘT): REAL-TIME AI SYSTEM LOGS */}
          <div className="lg:col-span-5 bg-gray-900 p-6 rounded-2xl text-white shadow-xl space-y-4 h-[280px] flex flex-col">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
              <h3 className="text-xs font-black tracking-wide uppercase text-white">
                Live AI Engine Logs
              </h3>
            </div>

            {/* Vùng cuộn logs */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-[11px] font-mono tracking-tight text-gray-300">
              {realTimeLogs.map((log) => (
                <div key={log.id} className="flex gap-2 items-start">
                  <span className="text-gray-500 shrink-0">{log.time}</span>
                  <span className={
                    log.type === 'success' ? 'text-green-400 font-bold' : log.type === 'warning' ? 'text-amber-400 font-bold' : 'text-blue-400'
                  }>
                    [{log.type.toUpperCase()}]
                  </span>
                  <p className="text-justify leading-tight">{log.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;