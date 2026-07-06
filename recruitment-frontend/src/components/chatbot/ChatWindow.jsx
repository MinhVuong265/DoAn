import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, X } from 'lucide-react';
import axios from 'axios';

const ChatWindow = ({ onClose }) => {
  // Trạng thái lưu danh sách tin nhắn (Bổ sung thêm trường sources để hiển thị tài liệu tham chiếu)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý Tuyển dụng AI. Bạn muốn tìm hiểu thông tin về công việc, chế độ đãi ngộ hay cần tư vấn sửa CV để phù hợp với các vị trí tuyển dụng không?',
      sources: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Bộ câu hỏi gợi ý nhanh để ứng viên tương tác với RAG
  const quickQuestions = [
    "Công ty NextGen yêu cầu kỹ năng Java thế nào?",
    "Chế độ phúc lợi và bảo hiểm ở đây ra sao?",
    "CV của tôi cần thêm gì để ứng tuyển Backend?"
  ];

  // Tự động cuộn xuống dòng tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Hàm xử lý luồng gửi tin nhắn thực tế kết nối Spring Boot thông qua DTO
  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isTyping) return;

    // 1. Đưa tin nhắn của Ứng viên lên giao diện hiển thị
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      sources: []
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true); // Bật hiệu ứng AI đang suy nghĩ thực tế

    try {
      // 2. Đóng gói gói tin chuẩn mẫu ChatRequest DTO của Backend
      const requestPayload = {
        message: textToSend,
        candidateId: localStorage.getItem("userId") || null, // Lấy ID ứng viên đã đăng nhập từ trước
        conversationId: "CONV_DEFAULT" // Gán mặc định hoặc sinh mã động nếu cần quản lý hội thoại
      };

      // 3. Thực hiện bắn POST API sang đầu cuối Spring Boot RAG Engine
      const response = await axios.post("http://localhost:8080/api/chatbot/ask", requestPayload);
      
      // 4. Bóc tách dữ liệu phản hồi từ cấu trúc ChatResponse DTO
      const aiReplyText = response.data.response;
      const references = response.data.sourcesSources; // Nhận mảng danh sách nguồn dữ liệu tham chiếu (Job Post, tài liệu HR)

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReplyText,
        sources: references || [] // Lưu kèm nguồn tham chiếu vào tin nhắn để hiển thị
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Lỗi kết nối hệ thống Chatbot RAG:", error);
      
      // Hiển thị thông báo lỗi trực quan lên giao diện chat khi mất kết nối Backend
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'ai',
        text: "❌ Hệ thống AI hiện tại đang bận xử lý dữ liệu hoặc mất kết nối mạng. Vui lòng thử lại sau giây lát!",
        sources: []
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false); // Tắt hiệu ứng gõ chữ nhấp nháy
    }
  };

  return (
    <div className="absolute bottom-16 right-0 w-[360px] sm:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-scale-up z-50">
      
      {/* A. TIÊU ĐỀ KHUNG CHAT (CHAT HEADER) */}
      <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Bot className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">Recruitment AI Bot</h3>
            <p className="text-[11px] text-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" /> Hệ thống RAG thông minh đang hoạt động
            </p>
          </div>
        </div>
        
        {/* Nút đóng cửa sổ chat */}
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition text-purple-100 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* B. VÙNG HIỂN THỊ TIN NHẮN (CHAT BODY) */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 max-w-[90%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
            
            {/* Avatar biểu tượng */}
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs shadow-sm ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-100'}`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-indigo-600" />}
            </div>

            {/* Khối bong bóng nội dung văn bản */}
            <div className="space-y-1.5 flex-1">
              <div className={`p-3 text-xs md:text-sm leading-relaxed rounded-2xl shadow-xs border whitespace-pre-line ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 rounded-tr-none' 
                  : 'bg-white text-gray-700 border-gray-100 rounded-tl-none text-justify'
              }`}>
                {msg.text}
              </div>

              {/* KHỐI HIỂN THỊ NGUỒN TRÍ THỨC THAM CHIẾU (Chỉ hiển thị với tin nhắn của AI có dữ liệu) */}
              {msg.sender === 'ai' && msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center pt-0.5 px-1">
                  <span className="text-[10px] text-gray-400 font-medium flex items-center gap-0.5 shrink-0">
                    <BookOpen className="w-2.5 h-2.5 text-indigo-500" /> Nguồn kiểm chứng:
                  </span>
                  {msg.sources.map((src, idx) => (
                    <span key={idx} className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md font-bold border border-indigo-100/50 uppercase tracking-tight">
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Hiệu ứng ba dấu chấm nhấp nháy khi AI đang thực thi thuật toán RAG */}
        {isTyping && (
          <div className="flex gap-2.5 max-w-[85%] mr-auto">
            <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
              <Bot className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* C. DANH SÁCH CÂU HỎI GỢI Ý NHANH (QUICK SUGGESTIONS) */}
      {messages.length === 1 && !isTyping && (
        <div className="px-4 pb-2 pt-1 bg-gray-50/50 space-y-1.5">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gợi ý câu hỏi:</p>
          <div className="flex flex-col gap-1">
            {quickQuestions.map((q, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="text-left text-xs bg-white hover:bg-purple-50 text-gray-600 hover:text-purple-700 p-2 rounded-xl border border-gray-100 hover:border-purple-200 transition-all truncate shadow-2xs"
              >
                💡 {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* D. KHU VỰC Ô NHẬP TIN NHẮN (CHAT INPUT BAR) */}
      <div className="p-3 bg-white border-t border-gray-100">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
          className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-purple-500 focus-within:bg-white transition-all"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isTyping ? "AI đang trả lời..." : "Hỏi AI về công việc, phúc lợi..."}
            disabled={isTyping}
            className="w-full bg-transparent text-sm text-gray-700 focus:outline-none py-1 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition shadow-md disabled:opacity-30 disabled:pointer-events-none active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatWindow;