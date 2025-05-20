import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import Product from './product/Product';
import Profile from '../pages/Profile';
import CheckOut from '../pages/CheckOut';
import Latest from '../pages/Latest';
import Contact from '../pages/Contact';
import Cart from './Cart';
import Login from '../Login';
import Register from '../Register';
import AdminDashboard from '../pages/AdminDashboard';
import Terms from '../terms/Terms';
import Privacy from '../privacy/Privacy';
import axios from 'axios';
import { CartProvider } from './CartContext';
import { LoadingProvider, useLoading } from './LoadingContext';
import LoadingSpinner from './LoadingSpinner';
import { API } from '../api';

const App = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const initialIsLoggedIn = !!localStorage.getItem('token');
  const initialUserName = storedUser ? storedUser.name : '';
  const initialUserRole = storedUser ? storedUser.role : '';

  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [userName, setUserName] = useState(initialUserName);
  const [userRole, setUserRole] = useState(initialUserRole);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      console.log('Token ellenőrzéshez:', token);
      if (token) {
        try {
          console.log('Setting loading to true in App');
          setLoading(true);
          const response = await axios.get(API.CHECK_LOGIN, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('API válasz /check-login:', response.data);
          if (response.status === 200) {
            const user = response.data.user;
            setIsLoggedIn(true);
            setUserName(user.name);
            setUserRole(user.role);
            localStorage.setItem('user', JSON.stringify(user));

            const isInitialLoad = !window.history.state;
            if (isInitialLoad) {
              if (user.role === 'admin' && window.location.pathname !== '/admin/dashboard') {
                navigate('/admin/dashboard', { replace: true });
              } else if (user.role === 'user' && window.location.pathname !== '/profile') {
                navigate('/profile', { replace: true });
              }
            }
          } else {
            console.warn('Váratlan státusz kód:', response.status);
          }
        } catch (error) {
          console.error("Bejelentkezési hiba:", error.response ? error.response.data : error.message);
          handleLogout();
        } finally {
          console.log('Setting loading to false in App');
          setLoading(false);
        }
      } else {
        console.log('No token, setting loading to false');
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigate, setLoading]);

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoading(true);
      axios
        .post(API.LOGOUT, {}, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setIsLoggedIn(false);
          setUserName('');
          setUserRole('');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        })
        .catch((error) => {
          console.error("Kijelentkezési hiba:", error);
          setIsLoggedIn(false);
          setUserName('');
          setUserRole('');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setUserRole('');
      navigate('/');
    }
  };

  return (
    <CartProvider>
      <Navbar isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop isLoggedIn={isLoggedIn} />} />
        <Route path="/latest" element={<Latest />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path="/profile"
          element={
            isLoggedIn && userRole === 'user'
              ? <Profile setUserName={setUserName} setUserRole={setUserRole} />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/dashboard"
          element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route path="/checkout" element={isLoggedIn ? <CheckOut /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/profile'} replace />
              : <Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserRole={setUserRole} />
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </CartProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <BrowserRouter>
    <LoadingProvider>
      <LoadingSpinner />
      <App />
    </LoadingProvider>
  </BrowserRouter>
);

export default App;