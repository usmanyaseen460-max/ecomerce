import React, { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import "./Checkout.css";

const CheckoutPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "Pakistan",
    province: "",
    city: "",
    customCity: "",
    address: "",
    apartment: "",
    postalCode: "",
    phone: "",
    saveInfo: false,
    payment: "COD",
    billingAddress: "same",
    agreeToTerms: false,
  });

  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonText, setButtonText] = useState("Complete Order");

  const provinces = {
    Punjab: ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot"],
    Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
    "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Abbottabad"],
    Balochistan: ["Quetta", "Gwadar", "Turbat"],
    "Gilgit-Baltistan": ["Gilgit", "Skardu", "Hunza"],
    "Azad Kashmir": ["Muzaffarabad", "Mirpur", "Rawalakot"],
  };

  useEffect(() => {
    const stored = localStorage.getItem("checkoutProduct");
    if (stored) setCheckoutProduct(JSON.parse(stored));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "province") {
      setForm({ ...form, [name]: value, city: "", customCity: "" });
      setErrors({ ...errors, province: "", city: "" });
    } else if (name === "city" && value !== "Other") {
      setForm({ ...form, [name]: value, customCity: "" });
      setErrors({ ...errors, city: "" });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.province) newErrors.province = "Province is required";
    if (!form.city) newErrors.city = "City is required";
    if (form.city === "Other" && !form.customCity.trim())
      newErrors.customCity = "Please enter your city name";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^03\d{9}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 11 digits starting with 03";
    }
    if (!form.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setButtonText("Processing...");

    const finalCity = form.city === "Other" ? form.customCity : form.city;

    const orderData = {
      name: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      province: form.province,
      city: finalCity,
      address: form.address,
      payment: form.payment,
      items: checkoutProduct
        ? checkoutProduct.variants.map((v) => ({
            productId: checkoutProduct.id,
            productName: checkoutProduct.name,
            color: v.color,
            quantity: v.quantity,
            price: checkoutProduct.price,
            image: v.image,
          }))
        : [],
      totalAmount: checkoutProduct
        ? checkoutProduct.variants.reduce(
            (sum, v) => sum + checkoutProduct.price * v.quantity,
            200
          )
        : 200,
      date: new Date().toISOString(),
    };

    fetch("https://mybackend-psi.vercel.app/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Order saved:", data))
      .catch((err) => console.error("❌ Error saving order:", err));

    setTimeout(() => {
      setOrderPlaced(true);
      setButtonText("Order Placed ✓");
    }, 1000);
  };

  const isFormValid =
    form.lastName &&
    form.province &&
    (form.city && (form.city !== "Other" || form.customCity)) &&
    form.address &&
    form.phone &&
    form.agreeToTerms;

  const productSubtotal = checkoutProduct
    ? checkoutProduct.variants.reduce(
        (sum, v) => sum + checkoutProduct.price * v.quantity,
        0
      )
    : 0;

  const shipping = 200;
  const total = productSubtotal + shipping;

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        {orderPlaced && (
          <div className="success-message">
            ✅ Order Placed Successfully! We'll contact you soon.
          </div>
        )}

        <div className="section">
          <h2 className="section-title">Delivery</h2>

          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="input"
          >
            <option>Pakistan</option>
          </select>

          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name (optional)"
            className="input"
            disabled={orderPlaced}
          />

          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name *"
            className={`input ${errors.lastName ? "input-error" : ""}`}
            disabled={orderPlaced}
          />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}

          <select
            name="province"
            value={form.province}
            onChange={handleChange}
            className={`input ${errors.province ? "input-error" : ""}`}
            disabled={orderPlaced}
          >
            <option value="">Select Province *</option>
            {Object.keys(provinces).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          {errors.province && <span className="error-text">{errors.province}</span>}

          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className={`input ${errors.city ? "input-error" : ""}`}
            disabled={!form.province || orderPlaced}
          >
            <option value="">
              {form.province ? "Select City *" : "First select province"}
            </option>
            {form.province &&
              provinces[form.province].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            {form.province && <option value="Other">Other (Type your city)</option>}
          </select>
          {errors.city && <span className="error-text">{errors.city}</span>}

          {form.city === "Other" && (
            <input
              type="text"
              name="customCity"
              value={form.customCity}
              onChange={handleChange}
              placeholder="Enter your city name *"
              className={`input ${errors.customCity ? "input-error" : ""}`}
              disabled={orderPlaced}
            />
          )}

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address *"
            className={`input ${errors.address ? "input-error" : ""}`}
            disabled={orderPlaced}
          />
          <input
            type="text"
            name="apartment"
            value={form.apartment}
            onChange={handleChange}
            placeholder="Apartment (optional)"
            className="input"
            disabled={orderPlaced}
          />
          <input
            type="text"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            placeholder="Postal Code (optional)"
            className="input"
            disabled={orderPlaced}
          />

          <div className="form-group phone-wrapper">
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone (03xxxxxxxxx) *"
              className={`input ${errors.phone ? "input-error" : ""}`}
              maxLength="11"
              disabled={orderPlaced}
            />
            <HelpCircle size={20} className="help-icon" />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              name="saveInfo"
              checked={form.saveInfo}
              onChange={handleChange}
              disabled={orderPlaced}
            />
            Save this information for next time
          </label>
        </div>

        {/* Shipping */}
        <div className="section">
          <h3 className="section-title">Shipping Method</h3>
          <div className="shipping-option">
            <span>Delivery</span>
            <span className="free-tag shipping-right">Rs 200</span>
          </div>
        </div>

        {/* Payment */}
        <div className="section">
          <h3 className="section-title">Payment</h3>
          <p className="secure-text">All transactions are secure and encrypted.</p>
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={form.payment === "COD"}
              onChange={handleChange}
              disabled={orderPlaced}
            />
            Cash on Delivery (COD)
          </label>
        </div>

        {/* Order Summary */}
        {checkoutProduct && (
          <div className="section product-summary">
            <h2 className="section-title">Order Summary</h2>

            {checkoutProduct.variants.map((v, i) => (
              <div className="product-summary-box" key={i}>
                <img src={v.image} alt={checkoutProduct.name} className="summary-img" />
                <div className="summary-info">
                  <h4>{checkoutProduct.name}</h4>
                  <p>Color: {v.color}</p>
                  <p>Quantity: {v.quantity}</p>
                  <p>
                    Price: Rs {(checkoutProduct.price * v.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs {productSubtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Rs {shipping}</span>
            </div>
            <div className="total-row">
              <span className="total-label">Total</span>
              <span className="total-amount">Rs {total.toLocaleString()}</span>
            </div>

            <label className="checkbox-wrapper" style={{ marginTop: "15px" }}>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={form.agreeToTerms}
                onChange={handleChange}
                disabled={orderPlaced}
              />
                I agree to the terms and conditions
            </label>
            {errors.agreeToTerms && (
              <span className="error-text">{errors.agreeToTerms}</span>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="button-container">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting || orderPlaced}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
