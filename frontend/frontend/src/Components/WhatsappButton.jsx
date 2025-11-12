import React from 'react';
import './WhatsappButton.css'; 

const WhatsappButton = () => {
  return (
    <a
      href="https://wa.me/9203251173461"  
      className="whatsapp-float"
      
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="whatsapp-icon"
        
      />
    </a>
  );
};

export default WhatsappButton;
