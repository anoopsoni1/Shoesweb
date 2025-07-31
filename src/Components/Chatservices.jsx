import React, { useState } from "react";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      role: "bot",
      text: "Hi! I’m your shoe assistant. Ask about orders, payments, or returns.",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const updatedChat = [...chat, { role: "user", text: message }];

    try {
      const res = await fetch("http://localhost:5000/api/v1/user/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: updatedChat.map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.text }],
          })),
        }),
      });

      const data = await res.json();
      const botReply = data.reply || "⚠️ Gemini did not return a reply.";

      setChat([...updatedChat, { role: "bot", text: botReply }]);
      setMessage("");
    } catch (error) {
      console.error("Gemini API error:", error);
      setChat([
        ...updatedChat,
        { role: "bot", text: "⚠️ Failed to connect to Gemini server." },
      ]);
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col border rounded-lg shadow-lg p-4">
      <div className="flex-1 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl text-sm max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask about shoes, payments, or orders..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
