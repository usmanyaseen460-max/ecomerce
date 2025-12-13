import React, { useContext, useRef, useState, useEffect } from "react";
import "./Navbar.css";
import shopLogo from "../Assets/shoplogo.png";
import cartlogo from "../Assets/cartlogo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { getTotalCartItems, all_products } = useContext(ShopContext);
  const menuRef = useRef();
  const navbarRef = useRef();
  const searchRef = useRef(); // ✅ NEW (sirf bug fix ke liye)
  const location = useLocation();
  const navigate = useNavigate();

  const [menu, setMenu] = useState("shop");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update active menu based on URL
  useEffect(() => {
    if (location.pathname === "/") setMenu("shop");
    else if (location.pathname === "/product") setMenu("product");
    else if (location.pathname === "/contact") setMenu("contact");
  }, [location.pathname]);

  // Click outside sidebar or search overlay to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.classList.contains("nav-dropdown")
      ) {
        setSidebarOpen(false);
      }

      // ✅ FIXED SEARCH LOGIC
      if (
        searchOpen &&
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        !e.target.classList.contains("nav-search-icon")
      ) {
        setSearchOpen(false);
        setSearchValue("");
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen, searchOpen]);

  /* ================= SEARCH LOGIC ================= */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const filtered = all_products.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filtered.slice(0, 6));
  };

  const openProduct = (id) => {
    navigate(`/product/${id}`);
    setSearchOpen(false);
    setSearchValue("");
    setResults([]);
    setSidebarOpen(false);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && results.length > 0) {
      openProduct(results[0].id);
    }
  };

  /* ================= SIDEBAR ================= */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (menuName) => {
    setMenu(menuName);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* ================= SEARCH OVERLAY ================= */}
      <div
        ref={searchRef}
        className={`search-overlay ${searchOpen ? "active" : ""}`}
      >
        <div className="search-box">
          <input
            type="text"
            placeholder="Search our store"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleEnter}
          />
          <FontAwesomeIcon icon={faSearch} className="search-input-icon" />
          <FontAwesomeIcon
            icon={faTimes}
            className="search-close"
            onClick={() => {
              setSearchOpen(false);
              setSearchValue("");
              setResults([]);
            }}
          />

          {results.length > 0 && (
            <div className="search-results">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="search-item"
                  onClick={() => openProduct(item.id)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= NAVBAR ================= */}
      <div
        className={`navbar ${sidebarOpen ? "sidebar-open" : ""} ${
          searchOpen ? "search-open" : ""
        }`}
        ref={navbarRef}
      >
        {/* SIDEBAR BUTTON */}
        {!sidebarOpen && (
          <FontAwesomeIcon
            icon={faBars}
            className="nav-dropdown"
            onClick={toggleSidebar}
          />
        )}

        {/* LOGO */}
        <div className="nav-logo">
          <Link to="/">
            <img src={shopLogo} alt="logo" />
          </Link>
        </div>

        {/* SIDEBAR MENU */}
        <ul>
          <div
            ref={menuRef}
            className={`nav-menu ${sidebarOpen ? "nav-menu-visible" : ""}`}
          >
            <Link to="/" onClick={() => handleMenuClick("shop")}>
              <li>
                Shop {menu === "shop" && <hr />}
              </li>
            </Link>

            <Link to="/product" onClick={() => handleMenuClick("product")}>
              <li>
                Products {menu === "product" && <hr />}
              </li>
            </Link>

            <Link to="/contact" onClick={() => handleMenuClick("contact")}>
              <li>
                Contact {menu === "contact" && <hr />}
              </li>
            </Link>
          </div>
        </ul>

        {/* LOGIN & CART */}
        <div className="nav-login-cart">
          {localStorage.getItem("auth-token") ? (
            <button
              onClick={() => {
                localStorage.removeItem("auth-token");
                window.location.replace("/");
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}

          {/* SEARCH ICON */}
          <FontAwesomeIcon
            icon={faSearch}
            className="nav-search-icon"
            onClick={() => setSearchOpen(true)}
          />

          <Link to="/cart">
            <img src={cartlogo} alt="cart" />
          </Link>

          {/* CART COUNTER */}
          <div className="nav-car-counter">{getTotalCartItems()}</div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
