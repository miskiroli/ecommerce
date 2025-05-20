import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './CheckOut.css';
import { CartContext } from '../components/CartContext';
import { Link } from 'react-router-dom';
import { API } from '../api';

const CheckOut = () => {
    const { cartItems, updateCart, fetchCartItems } = useContext(CartContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const calculateTotal = () => {
            const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
            setTotalPrice(total);
        };
        calculateTotal();
    }, [cartItems]);

    const handlePlaceOrder = () => {
        setLoading(true);
        const token = localStorage.getItem('token');
    
        const products = cartItems.map(item => ({
            id: item.product_id, 
            quantity: item.quantity
        }));
    
        axios.post(API.ORDER_CREATE, { products }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            updateCart([]); 
            setIsOrderPlaced(true); 
            setError('');
        })
        .catch(error => {
            setLoading(false);
            console.error('Error placing order:', error);
            setError('An error occurred while placing the order. Please try again.');
        })
        .finally(() => {
            setLoading(false); 
        });
    };

    if (isOrderPlaced) {
        return (
            <div className="checkout-success">
                <h2 className="success-title">Order Successful!</h2>
                <p className="success-message">Thank you for your purchase! Our team will contact you soon with the details.</p>
                <Link to="/" className="success-button">Back to Homepage</Link>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Order Summary</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="checkout-card">
                <table className="checkout-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.product.name}</td>
                                <td>{item.quantity}</td>
                                <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="checkout-total">
                    <h3 className="total-price">Total: ${totalPrice.toFixed(2)}</h3>
                </div>
                <button 
                    className="checkout-button" 
                    onClick={handlePlaceOrder} 
                    disabled={loading}
                >
                    {loading ? 'Processing Order...' : 'Place Order'}
                </button>
            </div>
        </div>
    );
}

export default CheckOut;