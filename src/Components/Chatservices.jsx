import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { products } from "./List";
import { FaRegHeart, FaShoppingBag, FaRegUserCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { clearUser } from "../Feature/Slicetwo";
import { clearCart } from "../Feature/slice";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const name = user?.FirstName || "Guest";

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 🧠 Helper: Format Gemini-style responses
  const formatAIResponse = (text) => {
    // Basic replacements for markdown-like styling
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>")
      .replace(/(✅|👟|🔥|⭐|💬)/g, "<span>$1</span>");
  };

  const handleAsk = useCallback(async () => {
    if (!question.trim() || loading) return;

    const userMessage = {
      role: "user",
      text: question,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "https://shoesbackend-4.onrender.com/api/v1/user/chat",
        { name, question, products }
      );

      const aiResponse = res.data?.data?.text || "Sorry, I didn’t catch that.";
      const formatted = formatAIResponse(aiResponse);

      const aiMessage = {
        role: "ai",
        text: formatted,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Frontend error:", err);
      const errorMessage =
        err.response?.data?.message || "Something went wrong while contacting AI.";
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: errorMessage,
          timestamp: new Date().toLocaleTimeString(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [question, loading, name]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://shoesbackend-4.onrender.com/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
      dispatch(clearUser());
      dispatch(clearCart());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-[99.8vh] backdrop-blur-md bg-white/70 border border-white/30 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Navbar */}
        <header className="h-[8.5vh] z-50 bg-white/80 backdrop-blur-md shadow">
          <nav className="flex justify-between items-center sm:px-6 sm:py-4 px-2 py-2 max-w-7xl mx-auto">
            <Link to="/" className="text-2xl font-extrabold tracking-wide">
              SoleMate
            </Link>
            <div className="flex sm:gap-5 gap-2 items-center">
              <Link to="/" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <FaRegHeart />
              </Link>
              <Link to="/cart" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <FaShoppingBag />
              </Link>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <FaRegUserCircle />
                </Link>
              )}
            </div>
          </nav>
        </header>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-white to-blue-50/50">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-3"
            >
              <p className="text-lg font-medium">Hi {name}, 👋</p>
              <p className="text-sm">
                I’m your SoleMate Assistant! Ask about our shoes, sizes, or get style recommendations 👟✨
              </p>
            </motion.div>
          )}

          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      {msg.role === "user" ? (
                        <User size={14} className="text-blue-500" />
                      ) : (
                        <Bot size={14} className="text-indigo-500" />
                      )}
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none"
                          : `bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-bl-none ${
                              msg.isError ? "border border-red-200 bg-red-50" : ""
                            }`
                      }`}
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="max-w-[85%] flex flex-col items-start">
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot size={14} className="text-indigo-500" />
                    <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="px-4 py-3 rounded-2xl shadow-sm bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-bl-none inline-flex items-center space-x-1">
                    <Loader2 size={16} className="animate-spin text-indigo-500" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="sm:p-4 p-1 gap-1 bg-white border-t flex items-center sm:space-x-2 shadow-lg">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about our shoes..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-70"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-md hover:scale-110 transition disabled:opacity-50"
          >
            <Send size={20} />
          </button>
          <button
            onClick={clearChat}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-md hover:scale-110 text-sm"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-50 text-red-700 text-sm text-center border-t border-red-100">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
}
