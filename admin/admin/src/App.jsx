import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';
import AdminLogin from './Pages/AdminLogin';
import OrdersPage from './Components/OrderPage/OrdersPage';

const App = () => {
  const token = localStorage.getItem('adminToken'); // check if admin logged in

  return (
    <div>
      <Navbar />

      <Routes>
        {/* ✅ Default route → if not logged in → go to adminlogin */}
        <Route
          path="/"
          element={!token ? <Navigate to="/adminlogin" /> : <Navigate to="/admin" />}
        />

        {/* ✅ Admin login page */}
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* ✅ Admin dashboard */}
        <Route path="/admin/*" element={<Admin />} />

        {/* Optional: Catch all invalid routes */}
        <Route path="*" element={<Navigate to="/" />} />
      
      </Routes>
    </div>
  );
};

export default App;
