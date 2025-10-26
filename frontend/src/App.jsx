import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomeScreen from "./HomeScreen";
import HealthCheckup from "./components/HealthCheckup";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/healthcheckup" element={<HealthCheckup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
}
