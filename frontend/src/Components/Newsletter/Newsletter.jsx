import React, { useState } from "react";
import "./Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("❌ Please enter your email address");
      return;
    }

    try {
      const res = await fetch("https://myecommercebackend.vercel.app/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Subscribed successfully!");
        setEmail("");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Newsletter error:", err);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="news-letter">
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated!</p>

      <div>
        <input
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>

      {message && <p className="newsletter-message">{message}</p>}
    </div>
  );
};

export default Newsletter;
