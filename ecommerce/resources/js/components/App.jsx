import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import Product from './product/Product';
import Profile from '../pages/Profile';
import CheckOut from '../pages/CheckOut';
import Cart from './Cart';
import Login from '../Login';
import Register from '../Register';
import AdminDashboard from '../pages/AdminDashboard';
import axios from 'axios';
import { CartProvider } from './CartContext';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  // Bejelentkezés ellenőrzése
  const checkLoginStatus = async () => {

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('/api/check-login', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const user = response.data.user;
          setIsLoggedIn(true);
          setUserName(user.name);
          setUserRole(user.role);
          localStorage.setItem('user', JSON.stringify(user));
  
          if (user.role === 'admin') {
            navigate('/profile', { replace: true });
          }
        }
      } catch (error) {
        console.error("Bejelentkezési hiba:", error);
        handleLogout();
      }
    }
  };
  
  

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/check-login', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            const user = response.data.user;
            setIsLoggedIn(true);
            setUserName(user.name);
            setUserRole(user.role);
  
            // Átirányítás admin esetén
            if (user.role === 'admin') {
              navigate('/admin/dashboard', { replace: true });
            }
          }
        } catch (error) {
          console.error("Bejelentkezési hiba:", error);
          handleLogout();
        }
      }
    };
  
    checkLoginStatus();
  }, [navigate]);
  

  // Kijelentkezés
  const handleLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .post('/api/logout', {}, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setIsLoggedIn(false);
          setUserName('');
          setUserRole('');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        });
    }
  };

  return (
    <CartProvider>
      <Navbar isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/shop" element={<Shop isLoggedIn={isLoggedIn} />} />
  <Route path="/product/:id" element={<Product />} />
  <Route path="/cart" element={<Cart />} />
  <Route
    path="/profile"
    element={isLoggedIn && userRole === 'user' ? <Profile /> : <Navigate to="/login" />}
  />
  <Route
    path="/admin/dashboard"
    element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
  />
  <Route path="/checkout" element={isLoggedIn ? <CheckOut /> : <Navigate to="/login" />} />
  <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
  <Route path="/register" element={<Register />}/>
</Routes>

    </CartProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default App;
