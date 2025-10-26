import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = e.target.message.value.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    e.target.reset();

    setLoading(true);

    
    try {
      const response = await fetch("http://127.0.0.1:8082/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userMessage }),
      });

      const data = await response.json();

      if (response.ok && data.output) {
        setMessages((prev) => [...prev, { text: data.output, sender: "bot" }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text:
              "Sorry, I couldn't process your message right now. Please try again later.",
            sender: "bot",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Server error. Please check your connection.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-teal-500 to-purple-600 text-white p-4 rounded-full shadow-lg"
        whileHover={{ scale: 1.2, rotate: 360 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        💬
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl w-80 h-96 flex flex-col mt-2"
          >
            <div className="bg-gradient-to-r from-teal-500 to-purple-600 text-white p-3 rounded-t-xl flex justify-between">
              <span className="font-semibold">Support Bot</span>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-purple-200"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-2 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-teal-100 text-gray-800"
                        : "bg-purple-100 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </span>
                </motion.div>
              ))}

              {loading && (
                <div className="text-gray-500 text-sm italic text-left mt-2">
                  Typing...
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t">
              <input
                type="text"
                name="message"
                placeholder="Type a message..."
                className="w-full p-2 bg-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={loading}
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
