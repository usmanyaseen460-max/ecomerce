import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import './updateproduct.css';

const colorsList = ["Red",
"Blue",
"Green",
"Yellow",
"Black",
"White",
"Pink",
"Off White",
"Brown",
"Dark Brown",
"Light Brown",
"Light Blue",
"Cream",
"Sky Blue",
"Royal Blue",
"Navy Blue",
"Tpink",
"Pista",
"Grey",
"Light Grey",
"Dark Grey",
"Mehroon",
"Mehndi",
"SevenUp",
"Zinc",
"Mustard",
"Orange",
"Dew",
"Aqua",
"Purple",
"Parrot",
"Malaysia",
"Camol",
"Niswari",
"Maroon",
"Olive",
"Mint",
"Peach",
"Coral",
"Lime",
"Turquoise",
"Teal",
"Cyan",
"Magenta",
"Beige",
"Coffee",
"Charcoal",
"Silver",
"Gold",
"Bronze",
"Rust",
"Salmon",
"Violet",
"Lavender",
"Mauve",
"Indigo",
"Denim",
"Sky Grey",
"Baby Blue",
"Sunflower",
"Fuchsia",
"Berry",
"Creamy White",
"Terracotta",
"Chocolate",
"Camel",
"Khaki",
"Eggplant",
"Mulberry",
"Sapphire",
"Ash Grey",
"Pastel Pink",
"Pastel Yellow",
"Pastel Green",
"Pastel Blue",
"Pastel Purple",
"Neon Green",
"Neon Pink",
"Neon Yellow",
"Neon Orange",
"Slate Blue",
"Slate Grey",
"Ocean Blue",
"Mint Green",
"Lemon",
"Lavender Grey",
"Plum",
"Coffee Brown",
"Walnut",
"Graphite",
"Papaya",
"Brick Red",
"Cranberry",
"Sea Green",
"Jade",
"Emerald",
"Shamrock",
"Cobalt Blue",
"Berry Pink",
"Orchid",
"Mustard Yellow",
"Olive Drab",
"Peacock Blue",
"Fire Red",
"Sunset Orange",
"Sky Pink",
"Frost Blue",
"Steel Grey",
"Sand",
"Khakhi Green",
"Beetroot",
"Copper",
"Peach Cream",
"Taupe",
"Almond",
"Pine Green",
"Rust Brown",
"Flamingo Pink",
"Lilac",
"Vanilla",
"Maple",
"Caramel",
"Ocean Green",
"Mint Cream",
"Blueberry",
"Cloud White",
"Sunset Pink",
"Terracotta Red",
"Pumpkin",
"Cerulean",
]; // Extend as needed

// Cloudinary configuration (replace with your actual values)
const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "your-cloud-name",          // <== Replace this
  UPLOAD_PRESET: "your-upload-preset",    // <== Replace this
  WIDGET_OPTIONS: {
    cropping: false,
    multiple: true,
    folder: "your-folder",                 // optional: cloudinary folder
    sources: ["local", "url", "camera"],
  }
};

const validateCloudinaryConfig = () => {
  return (
    CLOUDINARY_CONFIG.CLOUD_NAME &&
    CLOUDINARY_CONFIG.UPLOAD_PRESET
  );
};

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [sizes, setSizes] = useState([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageColorPairs, setImageColorPairs] = useState([]);
  const [cloudinaryWidget, setCloudinaryWidget] = useState(null);

  // Fetch product data on load
  useEffect(() => {
    fetch(`https://mybackend-psi.vercel.app/allproducts`)
      .then(res => res.json())
      .then(data => {
        const product = data.find(p => p.id === Number(id));
        if (product) {
          setTitle(product.name);
          setPrice(product.price);
          setDescription(product.description);
          setSizes(product.sizes || []);
          setImageColorPairs(product.variants.map(v => ({
            url: v.image,
            color: v.color || "",
            needsColor: false
          })));
        }
      });
  }, [id]);

  // Initialize Cloudinary widget
  useEffect(() => {
    if (!validateCloudinaryConfig()) {
      console.error("Cloudinary config incomplete");
      return;
    }
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
          uploadPreset: CLOUDINARY_CONFIG.UPLOAD_PRESET,
          ...CLOUDINARY_CONFIG.WIDGET_OPTIONS,
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            const newImage = {
              url: result.info.secure_url,
              color: "",
              needsColor: true,
            };
            setImageColorPairs(prev => [...prev, newImage]);
          }
        }
      );
      setCloudinaryWidget(widget);
    } else {
      console.warn("Cloudinary JS not loaded");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: title,
      price,
      description,
      sizes,
      images: imageColorPairs.map(item => ({ url: item.url, color: item.color })),
    };

    try {
      const response = await fetch(`https://mybackend-psi.vercel.app/updateproduct/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Product updated successfully!");
        navigate("/listproduct");
      } else {
        alert(`Update failed: ${data.message}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="updateproduct">
      <form onSubmit={handleSubmit}>
        <h2>Update Product</h2>

        <label>Product Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} />

        <label>Price</label>
        <input value={price} onChange={e => setPrice(e.target.value)} />

        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />

        <label>Sizes</label>
        <div className="sizes-wrapper">
          {["4 Meter", "4.5 Meter"].map(s => (
            <label key={s} className={`size-option ${sizes.includes(s) ? "selected" : ""}`}>
              <input
                type="checkbox"
                checked={sizes.includes(s)}
                onChange={() => sizes.includes(s)
                  ? setSizes(sizes.filter(sz => sz !== s))
                  : setSizes([...sizes, s])}
              />
              {s}
            </label>
          ))}
        </div>

        <div
          className="upload-btn"
          onClick={() => cloudinaryWidget && cloudinaryWidget.open()}
          style={{ cursor: "pointer", margin: "10px 0", padding: "8px 15px", border: "1.5px solid #4a90e2", borderRadius: "5px", color: "#4a90e2", fontWeight: "600", textAlign: "center", width: "fit-content" }}
        >
          Upload Images
        </div>

        <div className="uploaded-images">
          {imageColorPairs.map((item, idx) => (
            <div key={idx} className="image-item" style={{ marginBottom: "10px" }}>
              <img src={item.url} alt="product" width={100} style={{ marginRight: "10px", verticalAlign: "middle" }} />
              <select
                value={item.color || ""}
                onChange={e => {
                  const newArr = [...imageColorPairs];
                  newArr[idx].color = e.target.value;
                  setImageColorPairs(newArr);
                }}
                style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="">Select Color</option>
                {colorsList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          ))}
        </div>

        <button type="submit" className="update-btn">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
