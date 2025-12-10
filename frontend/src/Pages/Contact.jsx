import React, { useState } from "react";
import './Contact.css';

const WhatsAppContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, phone, email, message } = formData;

    const whatsappURL = `https://wa.me/+9203417659521?text=
      Name: ${name}%0A
      Phone: ${phone}%0A
      Email: ${email}%0A
      Message: ${message}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="contact-form">
      <form onSubmit={handleSubmit}>
        <h1>Contact</h1>

        {/* Name + Email side by side */}
        <div className="row">
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />

          <input
            type="email"
            id="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        {/* Phone field */}
        <div className="row">
          <input
            type="text"
            id="phone"
            placeholder="Your Phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field full"
            required
          />
        </div>

        {/* Message field */}
        <div className="row">
          <textarea
            id="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="input-field full"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="row">
          <button type="submit">Submit to WhatsApp</button>
        </div>
      </form>
    </div>
  );
};

export default WhatsAppContactForm;
