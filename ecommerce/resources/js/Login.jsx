import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Hozzáadva a Link komponens
import Swal from 'sweetalert2';
import './Login.css';
import { API } from './api';

const Login = ({ setIsLoggedIn, setUserName, setUserRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Bejelentkezés megkísérlése:', { email, password });
    try {
      const response = await axios.post(API.LOGIN, {
        email,
        password,
      });
      console.log('API válasz:', response.data);
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('A válasz nem tartalmaz token-t vagy user adatot.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setIsLoggedIn(true);
      setUserName(user.name);
      setUserRole(user.role);

      Swal.fire({
        title: 'Success login!',
        icon: 'success',
        confirmButtonColor: '#ff0000',
      });

      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    } catch (error) {
      console.error('Bejelentkezési hiba:', error.response ? error.response.data : error.message);
      Swal.fire({
        title: 'Hiba!',
        text: error.response?.data?.message || 'Bejelentkezés sikertelen. Ellenőrizd az adatokat.',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <Link to="/register">
        <button type="button" className="register-button">Register</button>
      </Link>
    </div>
  );
};

export default Login;