import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListProduct.css';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  const fetchInfo = async () => {
    try {
      const res = await fetch('https://mybackend-psi.vercel.app/allproducts');
      const data = await res.json();
      setAllProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch('https://mybackend-psi.vercel.app/removeproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        setAllProducts(prev => prev.filter(p => p.id !== id));
        alert('Product deleted successfully');
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  // ✅ Corrected navigation to include product ID in URL
 const edit_product = (product) => {
  navigate(`/admin/updateproduct/${product.id}`);
};


  return (
    <div className="listproduct">
      <h1>All Product List</h1>

      <div className="listproductformatmainheader">
        <p>Product Name</p>
        <p>Description</p>
        <p>Price</p>
        <p>Variants</p>
        <p>Actions</p>
      </div>

      <div className="listproductallproduct">
        {allproducts.map(product => (
          <div key={product.id} className="listproductformatmain">
            <p>{product.name}</p>
            <p>{product.description || 'No description'}</p>
            <p>Pkr : {product.price}</p>

            <div className="listproduct-variants-container">
              {product.variants?.length ? (
                product.variants.map((variant, idx) => (
                  <div key={idx} className="variant-item">
                    <img src={variant.image} alt={`${product.name} - ${variant.color}`} />
                    <p style={{ color: variant.color.toLowerCase() }}>{variant.color}</p>
                  </div>
                ))
              ) : <p>No variants</p>}
            </div>

            <div className="action-icons">
              <span
                className="editicon"
                style={{ cursor: 'pointer', marginRight: '10px' }}
                onClick={() => edit_product(product)}
                title="Edit Product"
              >
                ✏️
              </span>
              <span
                className="crossicon"
                style={{ cursor: 'pointer' }}
                onClick={() => remove_product(product.id)}
                title="Remove Product"
              >
                ❌
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
