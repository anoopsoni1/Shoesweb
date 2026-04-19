import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { products } from "./List";
import { useNavigate } from "react-router-dom";
import SiteHeader from "./SiteHeader.jsx";
import { clearUser } from "../Feature/Slicetwo.jsx";
import { clearCart } from "../Feature/slice.jsx";
import { clearCheckoutData } from "../Feature/Slicethree.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatAiReply(text) {
  return escapeHtml(text).replace(/\n/g, "<br />");
}

function newMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function Chatbot() {
  const { isDark } = useTheme();
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

  const catalogForChat = useMemo(
    () =>
      products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        type: p.type,
      })),
    []
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAsk = useCallback(async () => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const userMessage = {
      id: newMessageId(),
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${API_USER}/chat`,
        {
          name,
          question: trimmed,
          products: catalogForChat,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 90000,
        }
      );

      const raw =
        res.data?.data?.text ??
        res.data?.text ??
        res.data?.message ??
        "";
      const aiText =
        typeof raw === "string" && raw.trim()
          ? raw.trim()
          : "Sorry, I did not get a usable reply. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId(),
          role: "ai",
          html: formatAiReply(aiText),
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.answer ||
        (err.code === "ECONNABORTED"
          ? "Request timed out. Try a shorter question."
          : "Something went wrong while contacting the assistant.");
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId(),
          role: "ai",
          html: formatAiReply(errorMessage),
          isError: true,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [question, loading, name, catalogForChat]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_USER}/logout`, {}, { withCredentials: true });
    } catch {
      /* still sign out locally */
    }
    dispatch(clearUser());
    dispatch(clearCart());
    dispatch(clearCheckoutData());
    navigate("/login");
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    inputRef.current?.focus();
  };

  const shell = isDark
    ? "min-h-screen bg-zinc-950 text-zinc-100"
    : "min-h-screen bg-gradient-to-b from-slate-100 to-indigo-50 text-zinc-900";

  const panel = isDark
    ? "border-zinc-800 bg-zinc-900/95 shadow-2xl shadow-black/40"
    : "border-zinc-200/80 bg-white/95 shadow-xl shadow-zinc-300/30";

  const bubbleUser = isDark
    ? "bg-indigo-600 text-white"
    : "bg-indigo-600 text-white";
  const bubbleAi = isDark
    ? "border border-zinc-700 bg-zinc-800/90 text-zinc-100"
    : "border border-zinc-200 bg-white text-zinc-900";
  const bubbleErr = isDark
    ? "border border-red-900/60 bg-red-950/40 text-red-200"
    : "border border-red-200 bg-red-50 text-red-900";

  return (
    <div className={shell}>
      <div className={`mx-auto flex min-h-screen max-w-3xl flex-col border-x ${panel}`}>
        <SiteHeader onLogout={handleLogout} maxWidthClass="max-w-3xl" />

        <div
          className={`flex min-h-0 flex-1 flex-col overflow-hidden ${
            isDark ? "bg-zinc-950/50" : "bg-gradient-to-b from-white/80 to-indigo-50/40"
          }`}
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
            {messages.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center px-2 py-16 text-center"
              >
                <div
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
                    isDark ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  <Bot className="h-8 w-8" aria-hidden />
                </div>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Hi {name}
                </p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Ask about sizes, styles, or products in our catalog. I only use SoleMate
                  inventory to recommend shoes.
                </p>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[min(100%,28rem)] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}
                  >
                    <div className="flex items-center gap-2 px-1">
                      {msg.role === "user" ? (
                        <User className="h-3.5 w-3.5 text-indigo-500" aria-hidden />
                      ) : (
                        <Bot className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" aria-hidden />
                      )}
                      <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-500">
                        {msg.timestamp}
                      </span>
                    </div>
                    {msg.role === "user" ? (
                      <div
                        className={`rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed shadow-sm ${bubbleUser}`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      </div>
                    ) : (
                      <div
                        className={`rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed shadow-sm ${
                          msg.isError ? bubbleErr : bubbleAi
                        }`}
                        dangerouslySetInnerHTML={{ __html: msg.html }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex max-w-[min(100%,28rem)] flex-col gap-1">
                  <div className="flex items-center gap-2 px-1">
                    <Bot className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" aria-hidden />
                    <span className="text-[11px] text-zinc-500">Typing…</span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-2xl rounded-bl-md border px-4 py-3 text-sm ${bubbleAi}`}
                  >
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-indigo-500" />
                    Thinking…
                  </div>
                </div>
              </motion.div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          {error ? (
            <div
              className={`border-t px-4 py-2 text-center text-xs font-medium sm:text-sm ${
                isDark
                  ? "border-red-900/50 bg-red-950/30 text-red-200"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {error}
            </div>
          ) : null}

          <div
            className={`mt-auto flex shrink-0 flex-col gap-2 border-t p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-4 ${
              isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-white"
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about shoes, sizes, or delivery…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className={`min-h-[48px] flex-1 rounded-xl border px-4 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 ${
                isDark
                  ? "border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
                  : "border-zinc-300 bg-zinc-50 text-zinc-900 placeholder:text-zinc-500"
              }`}
              aria-label="Message"
            />
            <div className="flex items-center justify-end gap-2 sm:shrink-0">
              <button
                type="button"
                onClick={clearChat}
                className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition ${
                  isDark
                    ? "border-zinc-600 text-zinc-200 hover:bg-zinc-800"
                    : "border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Clear
              </button>
              <button
                type="button"
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="inline-flex h-11 min-w-[48px] items-center justify-center rounded-xl bg-indigo-600 px-4 font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Send"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
