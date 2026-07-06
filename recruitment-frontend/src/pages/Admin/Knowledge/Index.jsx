import React, { useState } from 'react';
import { BookOpen, Upload, FileText, Trash2, BrainCircuit, Sparkles, CheckCircle } from 'lucide-react';

const AdminKnowledge = () => {
  const [isEmbedding, setIsEmbedding] = useState(false);
  
  // Dữ liệu giả lập danh sách tài liệu tri thức đã nạp vào Vector DB phục vụ RAG
  const [documents, setDocuments] = useState([
    { id: 1, name: "Chính_sách_phúc_lợi_bảo_hiểm_2026.pdf", size: "1.4 MB", chunks: 24, status: "Indexed" },
    { id: 2, name: "Quy_trình_onboarding_nhân_sự_mới.pdf", size: "850 KB", chunks: 12, status: "Indexed" },
    { id: 3, name: "Cẩm_nang_văn_hóa_doanh_nghiệp_NextGen.pdf", size: "3.1 MB", chunks: 45, status: "Indexed" },
  ]);

  // Giả lập luồng Admin tải file PDF mới lên và ra lệnh cho hệ thống "Hóa Vector" (Embedding & Indexing)
  const handleUploadKnowledgeBase = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsEmbedding(true);

      try {
        // Giả lập Backend đang đọc file PDF, băm nhỏ nội dung text ra thành các đoạn và gọi API Embedding
        await new Promise(resolve => setTimeout(resolve, 3000));

        const newDoc = {
          id: Date.now(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          chunks: Math.floor(Math.random() * 20) + 5, // Số đoạn text băm ngẫu nhiên để test UI
          status: "Indexed"
        };

        setDocuments(prev => [newDoc, ...prev]);
        alert(`Đã nạp tri thức thành công! Tài liệu được chia nhỏ thành ${newDoc.chunks} đoạn vector lưu trữ ổn định.`);
      } catch (error) {
        console.error("Lỗi nạp tri thức:", error);
      } finally {
        setIsEmbedding(false);
      }
    }
  };

  const handleDeleteDocument = (id, name) => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài liệu [${name}] khỏi cơ sở tri thức Vector DB không? Chatbot sẽ không thể trả lời các câu hỏi liên quan đến tài liệu này nữa.`)) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* TIÊU ĐỀ TRANG KHỐI TRI THỨC */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-950">Kho Tri Thức Doanh Nghiệp (RAG Hub)</h2>
              <p className="text-xs text-gray-400 mt-0.5">Quản lý và nạp các tệp tài liệu nội bộ làm căn cứ dữ liệu cho Chatbot AI trả lời ứng viên.</p>
            </div>
          </div>

          {/* NÚT TẢI LÊN TÀI LIỆU (ẨN INPUT CHỌN FILE) */}
          <label className={`px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition active:scale-95 shrink-0 ${isEmbedding ? 'pointer-events-none opacity-50' : ''}`}>
            <Upload className="w-4 h-4" /> 
            {isEmbedding ? "AI Đang xử lý băm Vector..." : "NẠP TÀI LIỆU MỚI"}
            <input type="file" accept=".pdf" onChange={handleUploadKnowledgeBase} className="hidden" disabled={isEmbedding} />
          </label>
        </div>

        {/* HIỆU ỨNG LOADING KHI AI ĐANG CHUNKING & EMBEDDING FILE VỪA TẢI */}
        {isEmbedding && (
          <div className="p-5 bg-purple-50 border border-purple-100 rounded-2xl flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-purple-200">
              <BrainCircuit className="w-5 h-5 text-purple-600 animate-spin" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-900 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-500 animate-bounce" /> Hệ thống AI đang xử lý cấu trúc RAG...
              </h4>
              <p className="text-xs text-purple-600/70 mt-0.5">Đang đọc PDF - Phân rã văn bản (Text Chunking) - Chuyển đổi ma trận số hóa (Embedding) - Nạp vào Vector DB.</p>
            </div>
          </div>
        )}

        {/* 2. DANH SÁCH CÁC TÀI LIỆU ĐÃ NẠP THÀNH CÔNG */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Danh mục tài liệu tri thức đang hoạt động ({documents.length})
          </div>

          <div className="divide-y divide-gray-50">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                
                {/* Thông tin File văn bản */}
                <div className="flex items-start gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-black text-xs">
                    PDF
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-gray-800 truncate">{doc.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 font-medium">
                      <span>Dung lượng: {doc.size}</span>
                      <span>•</span>
                      <span className="text-purple-600 font-semibold flex items-center gap-0.5">
                        <BrainCircuit className="w-3 h-3" /> {doc.chunks} đoạn Vector
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trạng thái hoạt động + Hành động xóa tri thức */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-bold">
                    <CheckCircle className="w-3 h-3 text-green-600" /> Sẵn sàng (RAG Active)
                  </span>
                  
                  <button
                    onClick={() => handleDeleteDocument(doc.id, doc.name)}
                    className="p-2 border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl transition"
                    title="Xóa tri thức"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminKnowledge;