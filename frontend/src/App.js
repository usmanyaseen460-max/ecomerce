import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shope from './Pages/Shope';
import Cart from './Pages/Cart';
import ProductPage from './Pages/ProductPage';
import Product from './Pages/Product';  // <- import Product component
import Contact from './Pages/Contact';
import Loginsignup from './Pages/Loginsignup';
import CheckoutPage from './Components/Checkout/Checkout';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import WhatsappButton from './Components/WhatsappButton';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Shope />} />
        
        {/* Route for product list */}
        <Route path="/product" element={<Product />} />
        
        {/* Route for single product details */}
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
