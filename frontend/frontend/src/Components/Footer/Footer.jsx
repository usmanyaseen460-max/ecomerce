import React from 'react';
import './Footer.css';
import shopLogo from '../Assets/shoplogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <div className="foter">
      <div className="foter-logo">
        <a href="/">
          <img src={shopLogo} alt="Shop Logo" />
        </a>
        <p>UMAR SHAHBAZ FABRICS</p>
      </div>

      <ul className="foter-links">
        <li><a href="/" style={{ textDecoration: 'none', color: 'black',fontWeight:'600' }}>Shop</a></li>

        <li><a href="/product"style={{ textDecoration: 'none', color: 'black',fontWeight:'600' }}> Products</a></li>
       <li><a href="/login"style={{ textDecoration: 'none', color: 'black',fontWeight:'600' }}>Login Signup</a></li>
        <li><a href="/contact"style={{ textDecoration: 'none', color: 'black',fontWeight:'600' }}>Contact</a></li>
      </ul>

      <div className="foter-social-icon">
        <div className="foter-icon-container">
          <a href="https://www.facebook.com/MuhammadUmer190 " target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} style={{ fontSize: '16px', color: '#4267B2' }} />
          </a>
        </div>

        <div className="foter-icon-container">
           <a href="https://www.tiktok.com/@umer_shahbaz_fabrics?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '15px' }}>
      <FontAwesomeIcon icon={faTiktok} style={{ fontSize: '24px', color: '#000' }} />
    </a>
        </div>
      </div>

      <div className="foter-copyright">
        <hr />
        <p>Copyright @ 2025 - All Right Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
