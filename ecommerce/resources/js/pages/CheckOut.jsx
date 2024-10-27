import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './CheckOut.css';
import { CartContext } from '../components/CartContext';

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
    
        axios.post('/api/order', { products }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // Kosár kiürítése
            updateCart([]); 
            setIsOrderPlaced(true); // Rendelés sikeres
            setError('');
        })
        .catch(error => {
            setLoading(false);
            console.error('Error placing order:', error);
            setError('Hiba történt a rendelés leadásakor. Kérjük, próbálja meg újra.');
        })
        .finally(() => {
            // Eltávolítva a fetchCartItems() hívás
            setLoading(false); // Betöltési állapot kiürítése
        });
    };
    

    if (isOrderPlaced) {
        return (
            <div className="checkout-success">
                <h2>Rendelés sikeres!</h2>
                <p>Kollégáink hamarosan felveszik Önnel a kapcsolatot.</p>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h2>Rendelés összegzése</h2>
            {error && <div className="error-message">{error}</div>}
            <table className="checkout-table">
                <thead>
                    <tr>
                        <th>Termék</th>
                        <th>Mennyiség</th>
                        <th>Ár</th>
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
                <h3>Összesen: ${totalPrice.toFixed(2)}</h3>
            </div>
            <button className="checkout-button" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? 'Rendelés feldolgozása...' : 'Rendelés leadása'}
            </button>
        </div>
    );
}

export default CheckOut;
