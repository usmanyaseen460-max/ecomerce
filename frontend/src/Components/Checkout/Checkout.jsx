import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
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
    productId: null,
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

  // Load product and form
  useEffect(() => {
    const storedProduct = localStorage.getItem("checkoutProduct");
    const storedForm = localStorage.getItem("checkoutForm");

    if (storedProduct) {
      const parsedProduct = JSON.parse(storedProduct);
      setCheckoutProduct(parsedProduct);

      if (storedForm) {
        const parsedForm = JSON.parse(storedForm);

        if (parsedForm.productId === parsedProduct.id && !orderPlaced) {
          // Same product and order not placed → load saved form
          setForm(parsedForm);
        } else {
          // Different product OR order placed → reset form
          setForm({
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
            productId: parsedProduct.id,
          });
          localStorage.removeItem("checkoutForm");
          setOrderPlaced(false);
        }
      } else {
        setForm(f => ({ ...f, productId: parsedProduct.id }));
        setOrderPlaced(false);
      }
    }
  }, [orderPlaced]);

  const handleChange = (e) => {
    if (orderPlaced) return;

    const { name, value, type, checked } = e.target;
    let updatedForm = {
      ...form,
      [name]: type === "checkbox" ? checked : value,
      productId: checkoutProduct?.id,
    };

    if (name === "province") {
      updatedForm.city = "";
      updatedForm.customCity = "";
      setErrors({ ...errors, province: "", city: "" });
    }

    if (name === "city" && value !== "Other") {
      updatedForm.customCity = "";
      setErrors({ ...errors, city: "" });
    }

    setForm(updatedForm);
    localStorage.setItem("checkoutForm", JSON.stringify(updatedForm));
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
      .then((data) => {
        console.log("✅ Order saved:", data);

        setTimeout(() => {
          setOrderPlaced(true);
          setButtonText("Order Placed ✓");
          localStorage.removeItem("checkoutForm"); // clear form after order
          navigate("/orderconfirmation");
        }, 1000);
      })
      .catch((err) => {
        console.error("❌ Error saving order:", err);
        setIsSubmitting(false);
        setButtonText("Complete Order");
      });
  };

  const isFormValid =
    form.lastName &&
    form.province &&
    (form.city && (form.city !== "Other" || form.customCity)) &&
    form.address &&
    form.phone &&
    /^03\d{9}$/.test(form.phone);

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
           
          </div>

          
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
