import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Ambulance from "./pages/Ambulance"; // Assuming you create this page
import Doctor from "./pages/Doctor"; // Assuming you create this page

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
