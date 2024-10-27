import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom'; 

const Cart = () => {
    const { cartItems, updateCart } = useContext(CartContext); 
    const [items, setItems] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = () => {
        const token = localStorage.getItem('token');
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

    return (
        <div>
            <h2>Your Cart</h2>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => {
                        const images = item.product.images ? JSON.parse(item.product.images) : [];
                        return (
                            <tr key={item.id}>
                                <td>
                                    {images.length > 0 ? (
                                        <img src={`/storage/${images[0]}`} alt={item.product.name} width="50" />
                                    ) : (
                                        <span>No image available</span>
                                    )}
                                </td>
                                <td>{item.product.name}</td>
                                <td>
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                    {item.quantity}
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                </td>
                                <td>${item.product.price * item.quantity}</td>
                                <td>
                                    <button onClick={() => handleRemove(item.id)}>Remove</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div>
                <h3>Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
            </div>
            <button onClick={handleProceedToCheckout} className="checkout-button">Rendelés leadása</button>
        </div>
    );
};

export default Cart;
