import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token, user } = response.data;
  
      // Token mentése
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true);
  
      // Átirányítás admin és normál felhasználó esetén
      if (user.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    } catch (error) {
      console.error("Bejelentkezési hiba:", error);
      setError('Hibás email vagy jelszó.');
    }
  };
  

  return (
    <div className="login-container">
      <h2>Bejelentkezés</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Bejelentkezés</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
