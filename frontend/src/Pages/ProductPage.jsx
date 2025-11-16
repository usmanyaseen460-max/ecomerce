import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../Components/Context/ShopContext";
import "./ProductPage.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { all_products, addToCart } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]);

  useEffect(() => {
    const found = all_products.find((p) => p.id === Number(id));
    if (found) {
      setProduct(found);
      setCurrentImageIndex(0);
    }
  }, [all_products, id]);

  if (!product) return <p>Loading...</p>;

  const handleQuantityChange = (type) => {
    if (type === "increment") setQuantity((prev) => prev + 1);
    else if (type === "decrement" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.variants.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.variants.length - 1 ? 0 : prev + 1
    );
  };

  const handleColorSelect = (variant) => {
    const exists = selectedVariants.find((v) => v.color === variant.color);
    if (exists) {
      setSelectedVariants(selectedVariants.filter((v) => v.color !== variant.color));
    } else {
      setSelectedVariants([...selectedVariants, { ...variant, quantity }]);
    }
  };

  const handleBuyNow = () => {
    if (selectedVariants.length === 0) {
      alert("Please select at least one color before proceeding.");
      return;
    }

    const selectedData = {
      id: product.id,
      name: product.name,
      price: product.price,
      variants: selectedVariants,
    };

    localStorage.setItem("checkoutProduct", JSON.stringify(selectedData));
    navigate("/checkout");
  };

  const rating = product.rating || 4.5;

  return (
    <>
      <div className="luxury-container">
        <div className="luxury-product">
          <div className="image-section">
            <div className="main-image-box">
              <button className="arrow left-arrow" onClick={handlePrevImage}>
                &#8592;
              </button>
              <img
                src={product.variants[currentImageIndex].image}
                alt={product.name}
                className="main-image"
                onClick={() => setIsLightboxOpen(true)}
              />
              <button className="arrow right-arrow" onClick={handleNextImage}>
                &#8594;
              </button>
            </div>

            <div className="color-names-wrapper">
              {product.variants.map((v, idx) => {
                const selected = selectedVariants.some((sv) => sv.color === v.color);
                return (
                  <div
                    key={idx}
                    className={`color-name-box ${selected ? "selected" : ""}`}
                    onClick={() => handleColorSelect(v)}
                  >
                    <input type="checkbox" checked={selected} readOnly />
                    {v.color}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="details-section">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price">Rs. {product.price}</p>
            <p className="product-desc">{product.description}</p>

            <div className="fiveStar">
              {Array.from({ length: 5 }, (_, i) => {
                if (rating >= i + 1) return <FaStar key={i} color="#FFD700" size={22} />;
                else if (rating > i)
                  return <FaStarHalfAlt key={i} color="#FFD700" size={22} />;
                else return <FaRegStar key={i} color="#FFD700" size={22} />;
              })}
            </div>

            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange("decrement")}>−</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange("increment")}>+</button>
            </div>

            <div className="button-group">
              <button className="cart-button" onClick={() => addToCart(product.id, quantity)}>
                Add to Cart
              </button>
              <button className="buy-button" onClick={handleBuyNow}>
                Buy It Now
              </button>
            </div>
          </div>
        </div>

        {isLightboxOpen && (
          <div className="lightbox">
            <button className="arrow left-arrow" onClick={handlePrevImage}>
              &#8592;
            </button>
            <img
              src={product.variants[currentImageIndex].image}
              alt={product.name}
              className="lightbox-img"
              onClick={() => setIsLightboxOpen(false)}
            />
            <button className="arrow right-arrow" onClick={handleNextImage}>
              &#8594;
            </button>
            <span className="close-lightbox" onClick={() => setIsLightboxOpen(false)}>
              ✕
            </span>
          </div>
        )}
      </div>

      {/* ✅ Related Products */}
      <RelatedProducts productId={product.id} />
    </>
  );
};

export default ProductPage;
