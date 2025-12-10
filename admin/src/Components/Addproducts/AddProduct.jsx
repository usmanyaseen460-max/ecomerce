import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import uploadcloud from "../../assets/uploadcloud.png";
import {
  CLOUDINARY_CONFIG,
  validateCloudinaryConfig,
} from "../../config/cloudinary";

const colorsList = [
  "Red",
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
];

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageColorPairs, setImageColorPairs] = useState([]);
  const [errors, setErrors] = useState({});
  const [cloudinaryWidget, setCloudinaryWidget] = useState(null);

  // Cloudinary configuration - Replace with your actual cloud name
  const CLOUDINARY_CLOUD_NAME = "your-cloud-name"; // Replace with your Cloudinary cloud name
  const CLOUDINARY_UPLOAD_PRESET = "your-upload-preset"; // Replace with your upload preset

  useEffect(() => {
    // Validate configuration
    if (!validateCloudinaryConfig()) {
      console.error(
        "❌ Cloudinary configuration is incomplete. Please check src/config/cloudinary.js"
      );
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
            // Add uploaded image to the list for color selection
            const newImage = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
              color: "", // Will be selected by user
              needsColor: true,
            };
            setImageColorPairs((prev) => [...prev, newImage]);
          }
        }
      );
      setCloudinaryWidget(widget);
    }
  }, []);

  const openCloudinaryWidget = () => {
    if (cloudinaryWidget) {
      cloudinaryWidget.open();
    } else {
      alert("Cloudinary widget is not ready. Please try again.");
    }
  };

  const handleColorChange = (index, color) => {
    setImageColorPairs((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, color, needsColor: false } : item
      )
    );
  };

  const removeImage = (index) => {
    setImageColorPairs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Product title is required";
    if (!price.trim() || isNaN(price) || Number(price) <= 0)
      newErrors.price = "Valid price is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (imageColorPairs.length === 0)
      newErrors.images = "Upload at least one image with color";

    // Check if all images have colors assigned
    const imagesWithoutColor = imageColorPairs.filter((item) => !item.color);
    if (imagesWithoutColor.length > 0) {
      newErrors.images = "Please assign colors to all uploaded images";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Prepare data for submission with Cloudinary URLs
    const productData = {
      name: title,
      price: price,
      description: description,
      images: imageColorPairs.map((item) => ({
        url: item.url,
        publicId: item.publicId,
        color: item.color,
      })),
    };

    try {
      const response = await fetch("http://localhost:4000/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product uploaded successfully!");
        setTitle("");
        setPrice("");
        setDescription("");
        setImageColorPairs([]);
        setErrors({});
      } else {
        alert(`Upload failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error uploading product: ${error.message}`);
    }
  };

  return (
    <div className="addproduct">
      <form className="addproductitemfield" onSubmit={handleSubmit}>
        {/* Title */}
        <p>Product Title</p>
        <input
          type="text"
          name="name"
          placeholder="Type here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="error">{errors.title}</p>}

        {/* Description */}
        <p>Description</p>
        <textarea
          name="description"
          placeholder="Write product description here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="addproduct-textarea"
        />
        {errors.description && <p className="error">{errors.description}</p>}

        {/* Price */}
        <div className="addproductprice">
          <div className="addproductitemfield">
            <p>Price</p>
            <input
              type="text"
              name="Price"
              placeholder="Type here"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && <p className="error">{errors.price}</p>}
          </div>
        </div>

        {/* Cloudinary Image Upload */}
        <div className="addproductitemfield">
          <div onClick={openCloudinaryWidget} style={{ cursor: "pointer" }}>
            <img src={uploadcloud} alt="Upload" />
            <p>Upload Images with Cloudinary</p>
          </div>
          {errors.images && <p className="error">{errors.images}</p>}

          {/* Uploaded Images with Color Selection */}
          {imageColorPairs.length > 0 && (
            <div className="uploaded-images">
              <p>Uploaded Images - Assign colors:</p>
              <div className="image-color-grid">
                {imageColorPairs.map((item, idx) => (
                  <div key={idx} className="image-color-item">
                    <div className="image-container">
                      <img src={item.url} alt={`uploaded-${idx}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(idx)}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                    <select
                      value={item.color || ""}
                      onChange={(e) => handleColorChange(idx, e.target.value)}
                      className={item.needsColor ? "needs-color" : ""}
                    >
                      <option value="">Select color</option>
                      {colorsList.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                    {item.color && (
                      <div
                        className="color-preview"
                        style={{ backgroundColor: item.color.toLowerCase() }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="addproduct-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
