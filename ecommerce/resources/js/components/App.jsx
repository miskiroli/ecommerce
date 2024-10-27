import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import Product from './product/Product';
import Profile from '../pages/Profile';
import CheckOut from '../pages/CheckOut';
import Cart from './Cart';
import axios from 'axios';
import { CartProvider } from './CartContext';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
        axios.get('http://127.0.0.1:8000/api/check-login', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(response => {
            if (response.status === 200) {
                setIsLoggedIn(true);
                setUserName(response.data.name);
            }
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                setIsLoggedIn(false);
                setUserName('');
            }
        });
    }
}, []);


  const handleLogin = (token, user) => {
    localStorage.setItem('token', token); // Mentsd a tokent
    setIsLoggedIn(true);
    setUserName(user.name); // Beállítjuk a felhasználó nevét
    window.location.href = '/'; // Irányítsd a főoldalra
  };

  const handleLogout = () => {
    const token = localStorage.getItem('token');
  
    axios.post('http://127.0.0.1:8000/api/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(response => {
      if (response.status === 200) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserName('');
        window.location.href = '/';
      }
    })
    .catch(error => {
      console.error("Logout error:", error);
    });
  };
  

  return (

    <BrowserRouter>
     <CartProvider>
      <Navbar isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop isLoggedIn={isLoggedIn} />} />
        <Route path="/products/:id" element={<Product isLoggedIn={isLoggedIn} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
        <Route path="/checkout" element={isLoggedIn ? <CheckOut /> : <Navigate to = "/" />} />
      </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}
