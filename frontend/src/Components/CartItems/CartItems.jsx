import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import deleteicon from "../Assets/deleteicon.png";
import "./CartItems.css";

const CartItems = () => {
  const { all_products = [], cartItems = {}, addToCart, removeFromCart, proceedToCheckout } = useContext(ShopContext);

  console.log(cartItems);
  

  const subtotal = all_products.reduce((acc, item) => {
    const quantity = cartItems[item.id] || 0;
    const price = Number(item.price ?? 0);
    return acc + price * quantity;
  }, 0);

  const shippingFee = subtotal > 0 ? 200 : 0;
  const total = subtotal + shippingFee;

  return (
    <div className="cartitems">
      <h1 className="cart-heading">Your Shopping Cart</h1>

      <div className="cartitems-header">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {all_products.map((product) => {
        const quantity = cartItems[product.id] || 0;
        if (quantity === 0) return null;
        const price = Number(product.price ?? 0);

        return (
          <div className="cartitem" key={product.id}>
            <div className="cartitem-product">
              <img src={product.variants?.[0]?.image || product.image} className="cartitem-image" alt={product.name} />
            </div>

            <p className="cartitem-title">{product.name}</p>
            <p className="cartitem-price">Rs {price.toFixed(2)}</p>

            <div className="quantity-control">
              <button
                className="qty-btn minus"
                onClick={() => removeFromCart(product.id, 1)}
                disabled={quantity <= 1}
              >
                −
              </button>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const newQty = Math.max(1, Number(e.target.value));
                  const diff = newQty - quantity;
                  if (diff > 0) addToCart(product.id, diff);
                  else if (diff < 0) removeFromCart(product.id, -diff);
                }}
              />

              <button className="qty-btn plus" onClick={() => addToCart(product.id, 1)}>
                +
              </button>
            </div>

            <p className="cartitem-total">Rs {(price * quantity).toFixed(2)}</p>

            <img
              className="cartitem-remove"
              src={deleteicon}
              onClick={() => removeFromCart(product.id, quantity)}
              alt="remove"
            />
          </div>
        );
      })}

      {subtotal === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>Your cart is empty 😞</p>
      )}

      <div className="cartitems-summary">
        <div className="cart-summary-box">
          <h1>Cart Totals</h1>

          <div className="summary-row">
            <p>Subtotal</p>
            <p>PKR {subtotal.toFixed(2)}</p>
          </div>

          <div className="summary-row">
            <p>Shipping Fee</p>
            <p>PKR {shippingFee}</p>
          </div>

          <div className="summary-row total">
            <h3>Total</h3>
            <h3>PKR {total.toFixed(2)}</h3>
          </div>

          <Link to="/checkout">
            <button
              className="checkout-btn"
              onClick={() => {
                const checkoutData = all_products
                  .filter((p) => cartItems[p.id] > 0)
                  .map((p) => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    variants: [
                      {
                        color: "Default",
                        quantity: cartItems[p.id],
                        image: p.variants?.[0]?.image || p.image,
                      },
                    ],
                  }));

                localStorage.setItem(
                  "checkoutProduct",
                  JSON.stringify(checkoutData[0] || null)
                );
                
                if (proceedToCheckout) {
                  proceedToCheckout(checkoutData);
                }
              }}
            >
              PROCEED TO CHECKOUT
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
