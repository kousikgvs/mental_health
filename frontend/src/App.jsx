import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomeScreen from "./HomeScreen";
import HealthCheckup from "./components/HealthCheckup";
import Navbar from "./components/Navbar";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/healthcheckup" element={<HealthCheckup />} />
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
