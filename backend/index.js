const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const port = 4000;

require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ===== Middleware =====
app.use(express.json());
app.use(cors());

// ===== MongoDB Connection =====
mongoose
  .connect(
    "mongodb+srv://webdevwithusman:webdevwithusman@cluster0.cbo8qpt.mongodb.net/e-commerce"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ===== Cloudinary Config =====
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ===== Cloudinary Multer Storage =====
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce_products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;

// ===== Product Model =====
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  price: Number,
  variants: [{ color: String, image: String }],
});
const Product = mongoose.model("Product", productSchema);

// ===== User Model =====
const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  date: { type: Date, default: Date.now },
});

// ===== Admin Model =====
const Admin = mongoose.model("Admin", {
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// ===== Order Model =====
const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  province: String,
  city: String,
  address: String,
  payment: String,
  totalAmount: Number,
  items: Array,
  date: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

// ===== Newsletter Model =====
const newsletterSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  date: { type: Date, default: Date.now },
});
const Newsletter = mongoose.model("Newsletter", newsletterSchema);

// ===== Routes =====

// Home
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 E-commerce Backend API is running",
    status: "deployed",
    timestamp: new Date().toISOString(),
    endpoints: {
      products: "/allproducts",
      orders: "/api/orders",
      auth: "/login, /signup",
      admin: "/adminlogin"
    }
  });
});

// ===== Product APIs =====
app.post("/addproduct", upload.array("images"), async (req, res) => {
  try {
    let products = await Product.find({});
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const { name, price, description, colors } = req.body;
    const colorArr = Array.isArray(colors) ? colors : [colors];

    const variants = req.files.map((file, i) => ({
      color: colorArr[i],
      image: file.path,
    }));

    const product = new Product({ id, name, description, price, variants });
    await product.save();

    res.json({ success: true, message: "✅ Product added successfully", product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/removeproduct", async (req, res) => {
  const id = Number(req.body.id);
  await Product.findOneAndDelete({ id });
  res.json({ success: true, message: "Product deleted successfully" });
});

app.get("/allproducts", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// ===== User Auth APIs =====
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check)
    return res.status(400).json({ success: false, errors: "Email already used" });

  let cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();
  const token = jwt.sign({ id: user._id }, "secret_ecom");
  res.json({ success: true, token });
});

app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (!user) return res.json({ success: false, errors: "Invalid Email" });

  if (user.password !== req.body.password)
    return res.json({ success: false, errors: "Wrong Password" });

  const token = jwt.sign({ id: user._id }, "secret_ecom");
  res.json({ success: true, token });
});

// ===== Admin APIs =====
app.post("/adminlogin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin || admin.password !== password) {
      return res.json({ success: false, message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: admin._id }, "secret_admin", { expiresIn: "2h" });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/adminlogout", (req, res) => {
  res.json({ success: true, message: "Admin logged out" });
});

// ===== Order APIs =====
app.post("/api/orders", async (req, res) => {
  try {
    const { name, phone, province, city, address, payment, totalAmount, items } = req.body;

    const enrichedItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findOne({ id: item.productId });
      let productName = product ? product.name : "Unknown Product";
      
      let image = null;
      if (product && item.color) {
        const variant = product.variants.find(v => v.color === item.color);
        if (variant) image = variant.image;
      }

      return {
        ...item,
        productName,
        image,
      };
    }));

    const newOrder = new Order({
      name, phone, province, city, address, payment, totalAmount, items: enrichedItems
    });

    await newOrder.save();
    res.json({ success: true, message: "✅ Order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ date: -1 });

    const enrichedOrders = await Promise.all(orders.map(async (order) => {
      const updatedItems = await Promise.all(order.items.map(async (item) => {
        if (!item.productName) {
          const product = await Product.findOne({ id: item.productId });
          return {
            ...item,
            productName: product ? product.name : "Unknown Product"
          };
        }
        return item;
      }));
      return { ...order.toObject(), items: updatedItems };
    }));

    res.json(enrichedOrders);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.delete("/api/orders/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Error deleting order", error });
  }
});

// ===== Newsletter API =====
app.post("/api/newsletter", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    const exists = await Newsletter.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: "Already subscribed" });

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.status(200).json({ success: true, message: "✅ Subscribed successfully!" });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Fixed Related Products API (uses numeric id, not ObjectId)
app.get("/relatedproducts/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const all = await Product.find({});
    const others = all.filter((p) => p.id !== productId);
    const random3 = others.sort(() => 0.5 - Math.random()).slice(0, 3);

    res.json(random3);
  } catch (err) {
    console.error("Related products error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});
// Get Cart
app.post("/get/cart", async (req, res) => {
  try {
    const authToken = req.headers["auth-token"];
    if (!authToken) return res.status(401).json({ success: false, message: "Auth token missing" });

    const decoded = jwt.verify(authToken, "secret_ecom");
    const user = await Users.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json(user.cartData);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add to Cart
app.post("/addtocart", async (req, res) => {
  try {
    const authToken = req.headers["auth-token"];
    const decoded = jwt.verify(authToken, "secret_ecom");
    const user = await Users.findById(decoded.id);
    const { itemId, qty } = req.body;

    user.cartData[itemId] = (user.cartData[itemId] || 0) + qty;
    await user.save();

    res.json({ success: true, cartData: user.cartData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Remove from Cart
app.post("/removefromcart", async (req, res) => {
  try {
    const authToken = req.headers["auth-token"];
    const decoded = jwt.verify(authToken, "secret_ecom");
    const user = await Users.findById(decoded.id);
    const { itemId } = req.body;

    user.cartData[itemId] = Math.max((user.cartData[itemId] || 0) - 1, 0);
    await user.save();

    res.json({ success: true, cartData: user.cartData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== Start Server =====
app.listen(port, () => console.log(`🚀 Server Running on Port ${port}`));
