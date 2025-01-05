import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/profile/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  

  if (loading) {
    return <p>Loading order history...</p>;
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return <p>You have no previous orders.</p>;
  }

  return (
    <div>
      <h2>Your Order History</h2>
      {orders.map((order) => (
        <div key={order.order_id} className="order-card">
          <h3>Order ID: {order.order_id}</h3>
          <p>Order Date: {order.order_date}</p>
          <p>Total Amount: ${order.total_amount}</p>
          <p>Status: {order.status}</p>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                <strong>{item.product_name}</strong> - Quantity: {item.quantity} - Price: ${item.price} - Total: ${item.total_price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
