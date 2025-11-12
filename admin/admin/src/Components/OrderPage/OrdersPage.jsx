import React, { useEffect, useState } from "react";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/orders/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setOrders(prev => prev.filter(order => order._id !== id));
      alert("Order deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  };

  return (
    <div className="orders-container">
      <h2>📦 Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Products</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan="9" style={{textAlign:"center"}}>No orders yet 😞</td></tr>
          ) : (
            orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>{order.address}, {order.city}, {order.province}</td>
                <td>
                  {order.items.map((item, i) => (
                    <div key={i}>{item.productName} ({item.color}) x {item.quantity}</div>
                  ))}
                </td>
                <td>{order.payment}</td>
                <td>Rs {order.totalAmount.toLocaleString()}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td><button onClick={() => handleDelete(order._id)}>🗑️ Delete</button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
