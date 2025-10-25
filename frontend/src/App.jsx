import { motion, AnimatePresence } from "framer-motion";
import { Parallax } from "react-parallax";
import { FaBrain, FaHeart, FaHandsHelping } from "react-icons/fa";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-purple-50 to-blue-50 overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Parallax Background */}
      <Parallax
        bgImage="https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        strength={300}
        className="relative"
      >
        <section className="container mx-auto py-32 text-center relative z-10">
          <div className="backdrop-blur-md bg-white/30 p-10 rounded-2xl shadow-2xl max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-purple-600 mb-6"
            >
              Your Mental Health Matters
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-xl text-gray-800 mb-10 max-w-2xl mx-auto"
            >
              Discover a safe space for healing, support, and growth with resources tailored to your well-being.
            </motion.p>
            <motion.a
              href="#resources"
              whileHover={{ scale: 1.1, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-teal-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:from-teal-600 hover:to-purple-700 transition-all"
            >
              Start Your Journey
            </motion.a>
          </div>
        </section>
      </Parallax>

      {/* Resource Cards Section */}
      <section id="resources" className="container mx-auto py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center text-teal-600 mb-12"
        >
          Explore Our Resources
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaBrain className="text-4xl text-teal-500" />,
              title: "Mindfulness",
              description: "Practice meditation and breathing exercises to find inner peace.",
            },
            {
              icon: <FaHeart className="text-4xl text-purple-500" />,
              title: "Community Support",
              description: "Join our supportive community to share and connect.",
            },
            {
              icon: <FaHandsHelping className="text-4xl text-blue-500" />,
              title: "Professional Help",
              description: "Access licensed therapists and counselors.",
            },
          ].map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="flex justify-center mb-4">{resource.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{resource.title}</h3>
              <p className="text-gray-600">{resource.description}</p>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="mt-4 inline-block text-teal-500 font-medium hover:underline"
              >
                
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-600 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg">© 2025 Mental Health Journey. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#privacy" className="hover:text-purple-200">Privacy Policy</a>
            <a href="#terms" className="hover:text-purple-200">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}