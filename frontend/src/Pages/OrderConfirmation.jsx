import React from "react";
import "./orderconfirmation.css";

const OrderConfirmation = () => {
  return (
    <div className="confirmation-container">
      <h1 className="title">
        Order Placed Successfully <span role="img" aria-label="shopping bags">🛍️</span>
      </h1>
      <p className="greeting">Hi Customer,</p>
      <p className="order-number">
        Thank you for shopping with us! We’ve received your order .We will notify you when we send it.
      </p>
      <p className="contact-info">
        For any questions or concerns, please contact us on WhatsApp.
      </p>
    </div>
  );
};

export default OrderConfirmation;
