import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './OrderHistory.css';

const OrderHistory = ({ orders }) => {
  const [hasShownAlert, setHasShownAlert] = useState(false);

  useEffect(() => {
    if (orders && Array.isArray(orders) && orders.length === 0 && !hasShownAlert) {
      Swal.fire({
        title: 'Information',
        text: 'You have no previous orders.',
        icon: 'info',
        confirmButtonColor: '#ff0000',
      });
      setHasShownAlert(true);
    }
  }, [orders, hasShownAlert]);

  // Összeg kiszámítása, ha a total_price null vagy sztring
  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + (parseFloat(item.total_price) || 0), 0);
  };

  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      {orders && Array.isArray(orders) && orders.length === 0 ? (
        <div className="no-orders">
          <p>
            You have not placed any orders yet. Check out our products in the{' '}
            <Link to="/shop">Shop</Link>!
          </p>
        </div>
      ) : orders && Array.isArray(orders) ? (
        <div className="orders-grid">
          {orders.map((order, index) => {
            const total = parseFloat(order.total_price) || calculateTotal(order.items);
            return (
              <div key={order.order_id || `order-${index}`} className="order-card">
                <h3>Order ID: {order.order_id || `Unknown-${index}`}</h3>
                {order.order_date && (
                  <p>Date: {new Date(order.order_date).toLocaleString()}</p>
                )}
                <p>Total: <strong>${total.toFixed(2)}</strong></p>
                {order.status && <p>Status: {order.status}</p>}
                {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                  <div className="order-items">
                    <h4>Items:</h4>
                    <div className="items-grid">
                      {order.items.map((item, itemIndex) => (
                        <div key={`item-${order.order_id || index}-${itemIndex}`} className="item-card">
                          <div className="item-details">
                            <h5>{item.product_name || 'Unknown product'}</h5>
                            <p>Price: ${(parseFloat(item.price) || 0).toFixed(2)}</p>
                            <p>Quantity: {item.quantity || 1}</p>
                            <p>Total: ${(parseFloat(item.total_price) || 0).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div>Loading data...</div>
      )}
    </div>
  );
};

export default OrderHistory;