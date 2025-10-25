import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const userMessage = e.target.message.value;
    if (userMessage.trim()) {
      setMessages([...messages, { text: userMessage, sender: "user" }]);
      setMessages((prev) => [
        ...prev,
        { text: "Thank you for reaching out! How can I support you today?", sender: "bot" },
      ]);
      e.target.reset();
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
              <button onClick={() => setIsOpen(false)} className="hover:text-purple-200">✕</button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === "user" ? "bg-teal-100" : "bg-purple-100"
                    }`}
                  >
                    {msg.text}
                  </span>
                </motion.div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-3 border-t">
              <input
                type="text"
                name="message"
                placeholder="Type a message..."
                className="w-full p-2 bg-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}