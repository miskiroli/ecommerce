import axios from 'axios';

// A kosár elemeinek lekérése
export const getCartItems = async () => {
  const response = await axios.get('/api/cart');
  return response.data;
};

// Termék hozzáadása a kosárhoz
export const addToCart = async (productId, quantity = 1) => {
  const response = await axios.post('/api/cart/add', {
    product_id: productId,
    quantity: quantity,
  });
  return response.data;
};

// Kosár elem mennyiségének frissítése
export const updateCartItem = async (cartItemId, quantity) => {
  const response = await axios.post(`/api/cart/update/${cartItemId}`, {
    quantity: quantity,
  });
  return response.data;
};

// Kosár elem eltávolítása
export const removeCartItem = async (cartItemId) => {
  const response = await axios.delete(`/api/cart/remove/${cartItemId}`);
  return response.data;
};
