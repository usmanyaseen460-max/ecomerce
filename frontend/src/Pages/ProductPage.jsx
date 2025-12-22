import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../Components/Context/ShopContext";
import "./ProductPage.css";
import { FaStar, FaStarHalfAlt, FaRegStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { all_products, addToCart } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const found = all_products.find((p) => p.id === Number(id));
    if (found) {
      setProduct(found);
      setCurrentImageIndex(0);
      setSelectedVariants([]);
      setQuantity(1);
    }
  }, [all_products, id]);

  if (!product || !product.variants || product.variants.length === 0) return <p>Loading...</p>;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.variants.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.variants.length - 1 ? 0 : prev + 1));
  };

  const handleColorSelect = (variant, index) => {
    const exists = selectedVariants.find((v) => v.color === variant.color);
    if (exists) {
      setSelectedVariants(selectedVariants.filter((v) => v.color !== variant.color));
    } else {
      setSelectedVariants([...selectedVariants, { ...variant }]);
    }
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) => Math.max(1, type === "increment" ? prev + 1 : prev - 1));
  };

  const handleAddToCart = () => {
    if (selectedVariants.length === 0) {
      alert("Please select at least one color.");
      return;
    }
    selectedVariants.forEach((v) => addToCart(product.id, quantity, v.color));
    alert("Added to Cart!");
  };

  const handleBuyNow = () => {
    if (selectedVariants.length === 0) {
      alert("Please select at least one color.");
      return;
    }
    const selectedData = {
      id: product.id,
      name: product.name,
      price: product.price,
      variants: selectedVariants.map((v) => ({ ...v, quantity })),
    };
    localStorage.setItem("checkoutProduct", JSON.stringify(selectedData));
    navigate("/checkout");
  };

  const rating = product.rating || 4.5;

  return (
    <>
      <div className="luxury-container">
        <div className="luxury-product">
          {/* ===== IMAGE SECTION ===== */}
          <div className="image-section">
            <div className="main-image-box">
              <button className="arrow left-arrow" onClick={handlePrevImage}>
                <FaChevronLeft />
              </button>
              <img
                src={product.variants[currentImageIndex].image}
                alt={product.name}
                className="main-image"
                onClick={() => setIsLightboxOpen(true)}
              />
              <button className="arrow right-arrow" onClick={handleNextImage}>
                <FaChevronRight />
              </button>
            </div>

            {/* Color Selection */}
            <div className="color-names-wrapper">
              {product.variants.map((v, idx) => {
                const isSelected = selectedVariants.some((sv) => sv.color === v.color);
                return (
                  <div
                    key={idx}
                    className={`color-name-box ${isSelected ? "selected" : ""}`}
                    onClick={() => handleColorSelect(v, idx)}
                  >
                    <input type="checkbox" checked={isSelected} readOnly />
                    <span>{v.color}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== DETAILS SECTION ===== */}
          <div className="details-section">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price">Rs. {product.price}</p>
            
       {product.sizes && product.sizes.length > 0 && (
  <div className="product-size">
    <span className="size-label">Size:</span>
    <div className="size-options">
      {product.sizes.map((size) => (
        <span key={size} className="size-box">
          {size}
        </span>
      ))}
    </div>
  </div>
)}



            <p className="product-desc">{product.description}</p>

            {/* Permanent quantity selector above stars, left-aligned */}
            <div className="single-quantity-wrapper">
              <span>Quantity:</span>
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange("decrement")}>−</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange("increment")}>+</button>
              </div>
            </div>

            <div className="fiveStar">
              {Array.from({ length: 5 }, (_, i) => {
                if (rating >= i + 1) return <FaStar key={i} color="#FFD700" size={22} />;
                else if (rating > i) return <FaStarHalfAlt key={i} color="#FFD700" size={22} />;
                else return <FaRegStar key={i} color="#FFD700" size={22} />;
              })}
            </div>

            <div className="button-group">
              <button className="cart-button" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="buy-button" onClick={handleBuyNow}>
                Buy It Now
              </button>
            </div>
          </div>
        </div>

        {/* ===== LIGHTBOX ===== */}
        {isLightboxOpen && (
          <div className="lightbox">
            <button className="arrow left-arrow" onClick={handlePrevImage}>
              <FaChevronLeft />
            </button>
            <img
              src={product.variants[currentImageIndex].image}
              alt={product.name}
              className="lightbox-img"
              onClick={() => setIsLightboxOpen(false)}
            />
            <button className="arrow right-arrow" onClick={handleNextImage}>
              <FaChevronRight />
            </button>
            <span className="close-lightbox" onClick={() => setIsLightboxOpen(false)}>
              ✕
            </span>
          </div>
        )}
      </div>
      <RelatedProducts productId={product.id} />
    </>
  );
};

export default ProductPage;
