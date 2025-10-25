import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-teal-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Mental Health</div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
        <ul className={`md:flex space-x-6 text-white ${isOpen ? "block" : "hidden"} md:block`}>
          <li><a href="#home" className="hover:text-teal-200">Home</a></li>
          <li><a href="#about" className="hover:text-teal-200">About</a></li>
          <li><a href="#services" className="hover:text-teal-200">Services</a></li>
          <li><a href="#contact" className="hover:text-teal-200">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}