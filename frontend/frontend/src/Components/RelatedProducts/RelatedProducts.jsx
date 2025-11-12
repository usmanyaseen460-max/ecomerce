import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RelatedProducts.css";

const RelatedProducts = ({ productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!productId) return;
    fetch(`http://localhost:4000/relatedproducts/${productId}`)
      .then((res) => res.json())
      .then((data) => setRelatedProducts(data))
      .catch((err) => console.error("Related products fetch error:", err));
  }, [productId]);

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="related-section">
      <h2>Related Products</h2>
      <div className="related-grid">
        {relatedProducts.map((item) => (
          <div
            key={item._id}
            className="related-card"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <img src={item.variants[0]?.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p>Rs. {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
