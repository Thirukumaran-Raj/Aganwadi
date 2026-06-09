import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddChild from './pages/AddChild';
import ChildProfile from './pages/ChildProfile';
import Inventory from './pages/Inventory';
import Attendance from './pages/Attendance';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-child" element={<AddChild />} />
          <Route path="/child/:id" element={<ChildProfile />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;