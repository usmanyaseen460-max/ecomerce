import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Shope from './Pages/Shope';
import Cart from './Pages/Cart';
import ProductPage from './Pages/ProductPage';
import Product from './Pages/Product';
import Contact from './Pages/Contact';
import Loginsignup from './Pages/Loginsignup';
import CheckoutPage from './Components/Checkout/Checkout';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import WhatsappButton from './Components/WhatsappButton';

/* 🔹 TikTok Pixel Load (ESLint Safe) */
const loadTikTokPixel = () => {
  if (window.ttq) return;

  (function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = (w[t] = w[t] || []);
    ttq.methods = [
      "page","track","identify","instances","debug","on","off",
      "once","ready","alias","group","enableCookie","disableCookie",
      "holdConsent","revokeConsent","grantConsent"
    ];
    ttq.setAndDefer = function (t, e) {
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(ttq, ttq.methods[i]);
    }

    ttq.load = function (e) {
      var n = d.createElement("script");
      n.async = true;
      n.src =
        "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + e;
      var s = d.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(n, s);
    };

    ttq.load("D52LIRRC77U6T74NAJ80");
  })(window, document, "ttq");
};

/* 🔹 Track Page View on Route Change */
function TikTokPageView() {
  const location = useLocation();

  useEffect(() => {
    if (window.ttq) {
      window.ttq.page();
    }
  }, [location]);

  return null;
}

function App() {

  useEffect(() => {
    loadTikTokPixel();
  }, []);

  return (
    <BrowserRouter>
      <TikTokPageView />

      <Navbar />

      <Routes>
        <Route path="/" element={<Shope />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Loginsignup />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>

      <Footer />
      <WhatsappButton />
    </BrowserRouter>
  );
}

export default App;