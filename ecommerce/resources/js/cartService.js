import axios from 'axios';
import { API } from './api';

// A kosár elemeinek lekérése
export const getCartItems = async () => {
  const response = await axios.get(API.CART);
  return response.data;
};

// Termék hozzáadása a kosárhoz
export const addToCart = async (productId, quantity = 1) => {
  const response = await axios.post(API.CART_ADD, {
    product_id: productId,
    quantity: quantity,
  });
  return response.data;
};

// Kosár elem mennyiségének frissítése
export const updateCartItem = async (cartItemId, quantity) => {
  const response = await axios.post(API.CART_UPDATE(cartItemId), {
    quantity: quantity,
  });
  return response.data;
};

// Kosár elem eltávolítása
export const removeCartItem = async (cartItemId) => {
  const response = await axios.delete(API.CART_REMOVE(cartItemId));
  return response.data;
};
