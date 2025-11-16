import React, { useEffect, useState } from "react";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // optional: loading state
  const [error, setError] = useState(null); // optional: error state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://myecommercebackend.vercel.app/api/orders");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`https://myecommercebackend.vercel.app/api/orders/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to delete order");
      setOrders(prev => prev.filter(order => order._id !== id));
      alert("Order deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete order");
    }
  };

  if (loading) {
    return <div className="orders-container"><p>Loading orders...</p></div>;
  }

  if (error) {
    return <div className="orders-container"><p style={{ color: "red" }}>{error}</p></div>;
  }

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
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>No orders yet 😞</td>
            </tr>
          ) : (
            orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>{`${order.address}, ${order.city}, ${order.province}`}</td>
                <td>
                  {order.items.map((item, i) => (
                    <div key={i}>
                      {item.productName} ({item.color}) x {item.quantity}
                    </div>
                  ))}
                </td>
                <td>{order.payment}</td>
                <td>Rs {Number(order.totalAmount).toLocaleString()}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(order._id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
