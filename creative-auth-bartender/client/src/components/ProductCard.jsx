import React, { useState } from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);

  return (
    <div className="product-card" onClick={handleToggle} style={{ cursor: 'pointer' }}>
      <img src={product.image} alt={product.title} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>

        {expanded && (
          <div className="product-extra">
            <p className="product-description">{product.description}</p>
            <p className="product-category">Category: {product.category}</p>
            <p className="product-stock">Stock: {product.stock}</p>
            <p className="product-rating">⭐ {product.rating}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
