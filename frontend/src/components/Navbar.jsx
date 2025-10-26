import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/30 backdrop-blur-md p-4 fixed w-full z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-purple-600"
        >
          Mental Health
        </motion.div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        <ul
          className={`md:flex space-x-6 text-gray-800 ${
            isOpen ? "block" : "hidden"
          } md:block`}
        >
          <motion.li
            whileHover={{ scale: 1.1, color: "#0d9488" }}
            className="hover:text-teal-600 transition-colors"
          >
            <Link to="/">Home</Link>
            Home
          </motion.li>

          <motion.li
            whileHover={{ scale: 1.1, color: "#0d9488" }}
            className="hover:text-teal-600 transition-colors"
          >
            <Link to="/healthcheckup">Health Checkup</Link>
          </motion.li>
        </ul>
      </div>
    </nav>
  );
}
