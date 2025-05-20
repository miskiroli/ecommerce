import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Kosár elemek lekérése
    const fetchCartItems = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get(API.CART, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []); // Eltávolítottuk az üres tömböt, hogy mindig frissüljön

    const updateCart = (newCartItems) => {
        setCartItems(newCartItems); // Kosár frissítése
    };

    return (
        <CartContext.Provider value={{ cartItems, updateCart, fetchCartItems }}>
            {children}
        </CartContext.Provider>
    );
};
