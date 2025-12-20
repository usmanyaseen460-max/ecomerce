import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import "./Newcollection.css";

const Newcollections = () => {
  const { all_products, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  return (
    <div className="new-collection">
      <h1 className="page-title">NEW COLLECTIONS</h1>

      <div className="product-grid">
        {all_products && all_products.length > 0 ? (
          all_products.slice(-8).map((product) => (
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

                {/* ⭐ 5 Golden Stars */}
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
          ))
        ) : (
          <p>Wait For Products </p>
        )}
      </div>
    </div>
  );
};

export default Newcollections;
