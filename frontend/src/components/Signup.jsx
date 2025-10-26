import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setname] = useState("");
    const [groups, setgroups] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match. ❌");
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8083/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password , name, groups}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const data = await response.json();
      setMessage("Signup successful! Redirecting to Login... ✅");
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.message || "Signup failed. Please try again. ❌");
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-300 via-purple-300 to-pink-300">
      <div className="bg-white/90 p-10 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-teal-700">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-purple-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              isSuccess
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            <p>{message}</p>
          </div>
        )}

        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-teal-600 font-semibold hover:text-teal-800 transition duration-200"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
