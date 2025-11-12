import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // ✅ Use localhost 4000 for development
  const BACKEND_URL = 'http://localhost:4000';

  const handleLogin = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/adminlogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/admin';
      } else {
        setMessage(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="loginsignup">
      <div className="login-container">
        <h1>Admin Login</h1>
        <div className="login-signup-fields">
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Login</button>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminLogin;
