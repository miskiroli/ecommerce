const API_URL = window.env.REACT_APP_API_URL || 'shopzone.miskiroland.com/api'; // Fallback URL

export const API = {
  // Auth végpontok
  LOGIN: `${API_URL}/login`,
  REGISTER: `${API_URL}/register`,
  LOGOUT: `${API_URL}/logout`,
  CHECK_LOGIN: `${API_URL}/check-login`,

  // Profilkezelés (auth szükséges)
  PROFILE: `${API_URL}/profile`,
  PROFILE_UPDATE: `${API_URL}/profile`,
  PROFILE_PASSWORD: `${API_URL}/profile/password`,
  PROFILE_ADDRESS: `${API_URL}/profile/address`,
  PROFILE_ADDRESS_UPDATE: `${API_URL}/profile/address`,
  PROFILE_ORDERS: `${API_URL}/profile/orders`,

  // Termékek és kategóriák
  PRODUCTS: `${API_URL}/products`,
  PRODUCT_DETAIL: (id) => `${API_URL}/products/${id}`,
  CATEGORIES: `${API_URL}/categories`,
  LATEST: `${API_URL}/latest`,
  POPULAR: `${API_URL}/popular`,
  NEW_ARRIVALS: `${API_URL}/new-arrivals`,
  SIMILAR_PRODUCTS: (categoryId, excludeId, limit = 5) =>
    `${API_URL}/products?category_id=${categoryId}&limit=${limit}&exclude=${excludeId}`,

  // Kosár és rendelés (auth szükséges)
  CART_ADD: `${API_URL}/cart/add`,
  CART: `${API_URL}/cart`,
  CART_UPDATE: (id) => `${API_URL}/cart/${id}`,
  CART_REMOVE: (id) => `${API_URL}/cart/remove/${id}`,
  ORDER_CREATE: `${API_URL}/order`,
  ORDER_PRODUCTS: (orderId) => `${API_URL}/orders/${orderId}/products`,

  // Admin végpontok (auth és admin jogosultság szükséges)
  ADMIN_DASHBOARD: `${API_URL}/admin/dashboard`,
  ADMIN_USERS: `${API_URL}/admin/users`,
  ADMIN_USER_DELETE: (userId) => `${API_URL}/admin/users/${userId}`,
  ADMIN_PRODUCTS: `${API_URL}/admin/products`,
  ADMIN_PRODUCT_STORE: `${API_URL}/admin/products`,
  ADMIN_PRODUCT_EDIT: (productId) => `${API_URL}/admin/products/${productId}`,
  ADMIN_PRODUCT_UPDATE: (productId) => `${API_URL}/admin/products/${productId}`,
  ADMIN_PRODUCT_DELETE: (productId) => `${API_URL}/admin/products/${productId}`,
  ADMIN_ORDERS: `${API_URL}/admin/orders`,
};