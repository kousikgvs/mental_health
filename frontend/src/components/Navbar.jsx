import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (email) setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_email");
    localStorage.removeItem("access_token");
    setUserEmail(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white/30 backdrop-blur-md p-4 fixed w-full z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-purple-600"
        >
          Mental Health
        </motion.div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`md:flex items-center space-x-6 text-gray-800 ${
            isOpen ? "block mt-4" : "hidden"
          } md:block`}
        >
          <motion.li
            whileHover={{ scale: 1.1, color: "#0d9488" }}
            className="hover:text-teal-600 transition-colors"
          >
            <Link to="/">Home</Link>
          </motion.li>

          <motion.li
            whileHover={{ scale: 1.1, color: "#0d9488" }}
            className="hover:text-teal-600 transition-colors"
          >
            <Link to="/healthcheckup">Health Checkup</Link>
          </motion.li>

          {/* Conditionally show Login or Logout + Email */}
          {userEmail ? (
            <div className="flex items-center space-x-4">
              <motion.li className="text-gray-800 font-medium">{userEmail}</motion.li>
              <motion.li>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow hover:opacity-90 transition"
                >
                  Logout
                </button>
              </motion.li>
            </div>
          ) : (
            <motion.li
              whileHover={{ scale: 1.1 }}
              className="transition-transform"
            >
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl shadow hover:opacity-90 transition"
              >
                Login
              </Link>
            </motion.li>
          )}
        </ul>
      </div>
    </nav>
  );
}
