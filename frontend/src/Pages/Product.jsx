import React, { useContext } from "react";
import { ShopContext } from "../Components/Context/ShopContext";
import { useNavigate } from "react-router-dom";
import "./Product.css";

const Product = () => {
  const { all_products, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  return (
    <div className="product-page">
      <h2 className="page-title">Our Products</h2>

      <div className="product-grid">
        {all_products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/product/${product.id}`)}
          >
          
            {product.variants.length > 0 && (
              <img
                src={product.variants[0].image}
                alt={product.name}
                className="product-img"
              />
            )}

            <div className="product-info">
              <h3>{product.name}</h3>

              <p className="price">Rs. {product.price}</p>

              <div className="stars">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>

              <button
                className="add-btn"
                onClick={(e) => {
                  e.stopPropagation(); 
                  addToCart(product.id);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
