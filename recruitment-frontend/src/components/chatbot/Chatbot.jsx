import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi là trợ lý AI chuyên phân tích hồ sơ. Tôi có thể giúp gì cho bạn?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    // 1. Cập nhật tin nhắn của Người dùng lên giao diện
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, isBot: false }]);
    setLoading(true);

    try {
      // 2. Gọi API Endpoint xử lý AI Chatbot phía Spring Boot
      const response = await axios.post('http://localhost:8080/api/chatbot/ask', {
        message: userMessage
      });

      // 3. Cập nhật câu trả lời của Chatbot nhận từ Backend
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: response.data.reply, 
        isBot: true 
      }]);
    } catch (error) {
      console.error("Lỗi kết nối bộ não AI:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Hệ thống AI đang bận xử lý dữ liệu. Vui lòng thử lại sau ít phút!", 
        isBot: true 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* NÚT BONG BÓNG CHAT NỔI (FLOAT BUTTON) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center border border-white/20"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* KHUNG CỬA SỔ CHATBOT (CHAT WINDOW) */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[500px] bg-white rounded-2xl border border-gray-100 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* THANH TIÊU ĐỀ (HEADER) */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-wide uppercase">AI Recruitment Assistant</h3>
                <p className="text-[10px] text-indigo-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Trực tuyến hệ thống
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* VÙNG NỘI DUNG TIN NHẮN (MESSAGES CONTAINER) */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 space-y-3.5">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-2 max-w-[85%] ${msg.isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 w-7 h-7 border ${
                  msg.isBot ? 'bg-purple-50 border-purple-100 text-purple-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                }`}>
                  {msg.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  msg.isBot ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                }`}>
                  {msg.isBot ? (
              /* Chỉ render Markdown cho Bot và áp dụng định dạng chữ viết cho danh sách/tiêu đề */
              <div className="prose prose-xs max-w-none text-gray-800 break-words
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:my-1
                prose-h2:text-xs prose-h2:border-b prose-h2:pb-1 prose-h2:border-gray-100
                prose-h3:text-xs prose-h3:text-indigo-600 prose-h3:font-bold
                prose-ul:list-disc prose-ul:pl-4 prose-ul:my-1
                prose-li:my-0.5
                prose-p:my-0.5 prose-p:leading-relaxed"
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ) : (
              /* Giữ nguyên kiểu hiển thị thô và xuống dòng tự nhiên cho User */
              <div className="whitespace-pre-line break-words">
                {msg.text}
              </div>
            )}
                </div>
              </div>
            ))}

            {/* HIỆU ỨNG CHỜ AI PHẢN HỒI */}
            {loading && (
              <div className="flex gap-2 max-w-[85%] mr-auto items-center">
                <div className="p-2 bg-purple-50 border border-purple-100 text-purple-600 rounded-xl w-7 h-7 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3 bg-white border border-gray-100 text-gray-400 rounded-2xl rounded-tl-none text-xs font-medium flex items-center gap-1.5">
                  AI đang phân tích dữ liệu...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* KHU VỰC NHẬP TIN NHẮN (INPUT FORM) */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={4000}
              placeholder="Hỏi về kỹ năng, CV hoặc vị trí tuyển dụng..."
              disabled={loading}
              className="flex-1 py-2 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-indigo-600 flex items-center justify-center shadow-md active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default Chatbot;