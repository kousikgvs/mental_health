import { useState } from "react";
import { motion } from "framer-motion";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const userMessage = e.target.message.value;
    if (userMessage.trim()) {
      setMessages([...messages, { text: userMessage, sender: "user" }]);
      // Respond with the same text
      setMessages((prev) => [...prev, { text: userMessage, sender: "bot" }]);
      e.target.reset();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chatbot Icon */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        💬
      </motion.button>

      {/* Chatbot Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col mt-2"
        >
          <div className="bg-teal-600 text-white p-3 rounded-t-lg flex justify-between">
            <span>Chatbot</span>
            <button onClick={() => setIsOpen(false)} className="hover:text-teal-200">✕</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === "user" ? "bg-teal-100" : "bg-gray-200"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t">
            <input
              type="text"
              name="message"
              placeholder="Type a message..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </form>
        </motion.div>
      )}
    </div>
  );
}