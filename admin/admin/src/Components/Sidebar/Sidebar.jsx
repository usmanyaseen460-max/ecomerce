import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import addproduct from "../../assets/addproduct.png";
import listproduct from "../../assets/listproduct.png";
import orderlogo from "../../assets/orderlogo.png";
import { LogOutIcon } from "lucide-react"; // ✅ make sure lucide-react is installed

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminlogin");
  };

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <div className="sidebar">
        <Link to="/admin/addproduct" style={{ textDecoration: "none" }}>
          <div className="sidebaritem">
            <img src={addproduct} alt="Add Product" />
            <p>Add Product</p>
          </div>
        </Link>

        <Link to="/admin/listproduct" style={{ textDecoration: "none" }}>
          <div className="sidebaritem">
            <img src={listproduct} alt="Product List" />
            <p>Product List</p>
          </div>
        </Link>

        <Link to="/admin/orderspage" style={{ textDecoration: "none" }}>
          <div className="sidebaritem">
            <img src={orderlogo} alt="Orders Page" />
            <p>Orders Page</p>
          </div>
        </Link>

        <div className="sidebaritem logout" onClick={handleLogout}>
          <LogOutIcon size={22} />
          <p>Logout</p>
        </div>
      </div>

      {/* ===== Mobile Bottom Navbar ===== */}
      <div className="bottom-nav">
        <Link to="/admin/addproduct" className="nav-icon">
          <img src={addproduct} alt="Add Product" />
        </Link>

        <Link to="/admin/listproduct" className="nav-icon">
          <img src={listproduct} alt="Product List" />
        </Link>

        <Link to="/admin/orderspage" className="nav-icon">
          <img src={orderlogo} alt="Orders Page" />
        </Link>

        <div className="nav-icon" onClick={handleLogout}>
          <LogOutIcon size={22} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
