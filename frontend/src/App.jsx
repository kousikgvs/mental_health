import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <section className="container mx-auto py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-teal-600 mb-4"
        >
          Welcome to Your Mental Health Journey
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-gray-700 mb-8"
        >
          Find peace, support, and resources to nurture your mental well-being.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-teal-700"
        >
          Get Started
        </motion.button>
      </section>
      <Chatbot />
    </div>
  );
}