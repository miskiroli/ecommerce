import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CartContext } from './CartContext';
import { useNavigate, Link } from 'react-router-dom';
import './Cart.css'; 

const Cart = () => {
  const { cartItems, updateCart } = useContext(CartContext); 
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setItems([]);
      updateCart([]);
      return;
    }
    axios.get('/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setItems(response.data);
      updateCart(response.data); 
    })
    .catch(error => {
      console.error('Error fetching cart items:', error);
      setItems([]);
      updateCart([]);
    });
  };

  const handleRemove = (productId) => {
    const token = localStorage.getItem('token');
    axios.delete(`/api/cart/remove/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      fetchCartItems(); 
    })
    .catch(error => {
      console.error('Error removing item from cart:', error);
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    const token = localStorage.getItem('token');
    axios.put(`/api/cart/${productId}`, { quantity: newQuantity }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      fetchCartItems(); 
    })
    .catch(error => {
      console.error('Error updating item quantity:', error);
    });
  };

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const handleProceedToCheckout = () => {
    navigate('/checkout'); 
  };

  const getImageUrl = (image) => {
    if (!image) return 'http://127.0.0.1:8000/storage/placeholder.jpg';
    if (image.startsWith('http')) return image;
    return `http://127.0.0.1:8000/storage/${image}`;
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      <div className="cart-items">
        {items.length > 0 ? (
          items.map(item => {
            const images = item.product.images ? JSON.parse(item.product.images) : [];
            return (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-image">
                  <img
                    src={images.length > 0 ? getImageUrl(images[0]) : 'http://127.0.0.1:8000/storage/placeholder.jpg'}
                    alt={item.product.name}
                    className="cart-image"
                    onError={(e) => { e.target.src = 'http://127.0.0.1:8000/storage/placeholder.jpg'; }}
                  />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-price">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-cart-card">
            <div className="empty-cart-icon">🛒</div>
            <h3 className="empty-cart-title">Your cart is empty</h3>
            {!isLoggedIn && (
              <div className="auth-section">
                <p className="auth-message">Please log in or register to start shopping.</p>
                <div className="auth-buttons-container">
                  <Link to="/login">
                    <button className="login-btn">Log In</button>
                  </Link>
                  <Link to="/register">
                    <button className="register-btn">Register</button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {items.length > 0 && (
        <div className="cart-summary">
          <h3 className="total-price">Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
          <button onClick={handleProceedToCheckout} className="checkout-button">
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;