import React, { useState } from 'react';
import './AddProduct.css';
import uploadcloud from '../../assets/uploadcloud.png';

const colorsList = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Pink', 'Off White', 'Brown','Dark Brown','Light Brown', 'Light Blue','Cream','Sky Blue','Royal Blue','Navy Blue','Tpink','Pista','Grey','Light Grey','Dark Grey','Mehroon','Mehndi','SevenUp','Zinc','Mustard','orange','Dew','Aqua','Purple','Parrot','Malaysia','Camol','Niswari'];

const AddProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageColorPairs, setImageColorPairs] = useState([]);
  const [errors, setErrors] = useState({});
  const [tempFiles, setTempFiles] = useState([]);
  const [tempColorSelections, setTempColorSelections] = useState({});

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(file => file);
    setTempFiles(files);
    const newTempColors = {};
    files.forEach((_, idx) => {
      newTempColors[idx] = '';
    });
    setTempColorSelections(newTempColors);
  };

  const handleTempColorChange = (index, color) => {
    setTempColorSelections(prev => ({
      ...prev,
      [index]: color,
    }));
  };

  const addFilesWithColors = () => {
    for (let idx = 0; idx < tempFiles.length; idx++) {
      if (!tempColorSelections[idx]) {
        alert(`Please select color for image ${idx + 1}`);
        return false;
      }
    }

    const pairsToAdd = tempFiles.map((file, idx) => ({
      file,
      color: tempColorSelections[idx],
    }));

    const filteredPairsToAdd = pairsToAdd.filter(newPair =>
      !imageColorPairs.some(
        existingPair =>
          existingPair.file.name === newPair.file.name && existingPair.color === newPair.color
      )
    );

    setImageColorPairs(prev => [...prev, ...filteredPairsToAdd]);
    setTempFiles([]);
    setTempColorSelections({});
    return true;
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Product title is required';
    if (!price.trim() || isNaN(price) || Number(price) <= 0) newErrors.price = 'Valid price is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (imageColorPairs.length === 0) newErrors.images = 'Upload at least one image with color';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const added = addFilesWithColors();
    if (!added) return;

    const combinedPairs = [...imageColorPairs, ...tempFiles.map((file, idx) => ({
      file,
      color: tempColorSelections[idx],
    }))];

    if (!validate()) return;

    const formData = new FormData();
    formData.append('name', title);
    formData.append('price', price);
    formData.append('description', description);

    combinedPairs.forEach(({ file, color }) => {
      formData.append('images', file);
      formData.append('colors', color);
    });

    try {
      const response = await fetch('https://myecommercebackend.vercel.app/addproduct', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product uploaded successfully!');
        setTitle('');
        setPrice('');
        setDescription('');
        setImageColorPairs([]);
        setTempFiles([]);
        setTempColorSelections({});
        setErrors({});
      } else {
        alert(`Upload failed: ${data.message || 'Unknown error'}`);
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

        {/* Image Upload */}
        <div className="addproductitemfield">
          <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
            <img src={uploadcloud} alt="Upload" />
            <p>Upload Images (then select color for each)</p>
          </label>
          <input
            type="file"
            name="images"
            id="file-input"
            multiple
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
          {errors.images && <p className="error">{errors.images}</p>}

          {/* Temporary Image Preview with Color */}
          {tempFiles.length > 0 && (
            <div className="temp-file-color-selection">
              {tempFiles.map((file, idx) => (
                <div key={idx}>
                  <img src={URL.createObjectURL(file)} alt={`temp-${idx}`} />
                  <select
                    value={tempColorSelections[idx] || ''}
                    onChange={(e) => handleTempColorChange(idx, e.target.value)}
                  >
                    <option value="">Select color</option>
                    {colorsList.map(color => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Uploaded Images */}
          {imageColorPairs.length > 0 && (
            <div className="uploaded-images">
              <p>Uploaded Images (click image to see color):</p>
              <div>
                {imageColorPairs.map(({ file, color }, idx) => (
                  <div key={idx}>
                    <img src={URL.createObjectURL(file)} alt={`uploaded-${idx}`} />
                    <p style={{ color: color.toLowerCase() }}>{color}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="addproduct-btn">ADD</button>
      </form>
    </div>
  );
};

export default AddProduct;
