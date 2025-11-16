import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  const cart = {};
  for (let index = 0; index <= 300; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_products, setAll_Products] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [checkoutData, setCheckoutData] = useState({ products: [], subtotal: 0, shipping: 0, total: 0 });

  useEffect(() => {
    fetch("https://myecommercebackend.vercel.app/allproducts")
      .then((res) => res.json())
      .then((data) => setAll_Products(data));

    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch("https://myecommercebackend.vercel.app/get/cart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({}),
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data));
    }
  }, []);

  const addToCart = (itemId, qty = 1) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + qty }));
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch("https://myecommercebackend.vercel.app/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ itemId, qty }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch("https://myecommercebackend.vercel.app/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, qty) => total + (qty > 0 ? qty : 0), 0);
  };

  const proceedToCheckout = () => {
    const products = all_products.filter((p) => cartItems[p.id] > 0).map((p) => ({
      id: p.id,
      name: p.name,
      qty: cartItems[p.id],
      price: Number(p.new_price ?? p.new_Price ?? p.newPrice ?? 0),
    }));

    const subtotal = products.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = subtotal > 0 ? 200 : 0;
    const total = subtotal + shipping;

    setCheckoutData({ products, subtotal, shipping, total });
  };

  return (
    <ShopContext.Provider
      value={{
        all_products,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartItems,
        checkoutData,
        proceedToCheckout,
      }}
    >
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
