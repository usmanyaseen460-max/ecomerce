import React, { useContext, useRef, useState, useEffect } from 'react';
import './Navbar.css';
import shopLogo from '../Assets/shoplogo.png';
import cartlogo from '../Assets/cartlogo.png';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const {getTotalCartItems} = useContext(ShopContext);
  const menuRef = useRef();
  const location = useLocation();
  const [menu, setMenu] = useState("shop");

  // detect current path and set menu highlight on refresh
  useEffect(() => {
    if (location.pathname === "/") setMenu("shop");
    else if (location.pathname === "/product") setMenu("product");
    else if (location.pathname === "/contact") setMenu("contact");
  }, [location.pathname]);

  // toggle sidebar
  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');

    document.body.style.overflow = menuRef.current.classList.contains('nav-menu-visible')
      ? 'hidden'
      : 'auto';
  };

  // close sidebar when clicking a link
  const closeSidebar = () => {
    if (menuRef.current.classList.contains('nav-menu-visible')) {
      menuRef.current.classList.remove('nav-menu-visible');
      document.body.style.overflow = 'auto';
    }
    const icon = document.querySelector('.nav-dropdown.open');
    if (icon) icon.classList.remove('open');
  };

  return (
    <div className="navbar">
      <FontAwesomeIcon
        icon={faBars}
        className="nav-dropdown"
        onClick={dropdown_toggle}
      />

      <div className="nav-logo">
        <a href="/">
          <img src={shopLogo} alt="Shop Logo" />
        </a>
      </div>

      <ul>
        <div ref={menuRef} className="nav-menu">

          <Link
            to="/"
            className="nav-link-shop"
            style={{ textDecoration: 'none', color: 'black' }}
            onClick={() => { setMenu("shop"); closeSidebar(); }}
          >
            <li>
              Shop
              {menu === "shop" ? <hr /> : null}
            </li>
          </Link>

          <Link
            to="/product"
            style={{ textDecoration: 'none', color: 'black' }}
            onClick={() => { setMenu("product"); closeSidebar(); }}
          >
            <li>
              Products
              {menu === "product" ? <hr /> : null}
            </li>
          </Link>

          <Link
            to="/contact"
            style={{ textDecoration: 'none', color: 'black' }}
            onClick={() => { setMenu("contact"); closeSidebar(); }}
          >
            <li>
              Contact
              {menu === "contact" ? <hr /> : null}
            </li>
          </Link>

        </div>
      </ul>

      <div className="nav-login-cart">
        {localStorage.getItem('auth-token')
        ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
      :<Link to="/login"><button>Login</button></Link>}

       
        <Link to="/cart"><img src={cartlogo} alt="cart logo" /></Link>
        <div className="nav-car-counter">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;