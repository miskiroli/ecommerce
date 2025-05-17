import React from 'react';
import './OrderList.css';

const OrdersList = ({ orders }) => {
  return (
    <div className="orders-list">
      <h2>Orders List</h2>
      {orders && orders.length > 0 ? (
        <>
          {/* Desktop és táblagép nézetben táblázat */}
          <table className="orders-table-desktop">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Order Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Products</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user_name}</td>
                  <td>{order.user_email}</td>
                  <td>{order.order_date}</td>
                  <td>{order.total_amount} USD</td>
                  <td>{order.status}</td>
                  <td>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.product_name} - {item.quantity} pcs - {item.total_price} USD
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobil nézetben kártyák */}
          <div className="orders-cards">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-row">
                  <span className="order-card-label">Order ID:</span>
                  <span className="order-card-value">{order.id}</span>
                </div>
                <div className="order-card-row">
                  <span className="order-card-label">User:</span>
                  <span className="order-card-value">{order.user_name}</span>
                </div>
                <div className="order-card-row">
                  <span className="order-card-label">Email:</span>
                  <span className="order-card-value">{order.user_email}</span>
                </div>
                <div className="order-card-row">
                  <span className="order-card-label">Order Date:</span>
                  <span className="order-card-value">{order.order_date}</span>
                </div>
                <div className="order-card-row">
                  <span className="order-card-label">Total:</span>
                  <span className="order-card-value">{order.total_amount} USD</span>
                </div>
                <div className="order-card-row">
                  <span className="order-card-label">Status:</span>
                  <span className="order-card-value">{order.status}</span>
                </div>
                <div className="order-card-row">
                  <span className="order-card-label">Products:</span>
                  <ul className="order-card-products">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.product_name} - {item.quantity} pcs - {item.total_price} USD
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="no-orders">No orders available.</p>
      )}
    </div>
  );
};

export default OrdersList;