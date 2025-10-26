import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; 

export default function Navbar({ appointments = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (email) setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_email");
    localStorage.removeItem("access_token");
    setUserEmail(null);
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

          {/* Conditionally show Login or Profile + Logout */}
          {userEmail ? (
            <div className="flex items-center space-x-4 relative">
              {/* Profile Icon */}
              <motion.div
                className="relative cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <FaUserCircle size={28} className="text-gray-700 hover:text-teal-600 transition" />

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
                    <p className="font-semibold mb-2">Appointments:</p>
                    {appointments.length > 0 ? (
                      <ul className="text-gray-700 space-y-2 max-h-48 overflow-y-auto">
                        {appointments.map((appt, idx) => (
                          <li key={idx} className="border-b pb-1">
                            <p className="font-medium">{appt.doctor_name}</p>
                            <p className="text-sm">{new Date(appt.appointment_date).toLocaleString()}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">No appointments booked</p>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Email */}
              <motion.li className="text-gray-800 font-medium">{userEmail}</motion.li>

              {/* Logout */}
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
