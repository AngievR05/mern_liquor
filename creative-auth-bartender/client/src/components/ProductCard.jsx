import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product, showAddToCart = true, onLoginToBuy }) => {
  const [expanded, setExpanded] = useState(false);
  const { addToCart } = useCart();

  const loggedInUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('loggedInUser'));
    } catch {
      return null;
    }
  })();

  // Toggle expanded state on card click (except on Add to Cart button)
  const handleCardClick = (e) => {
    // Prevent toggle if clicking the add-to-cart button or its children
    if (
      showAddToCart &&
      (e.target.closest('.add-to-cart-btn') ||
        e.target.classList.contains('add-to-cart-btn'))
    ) {
      return;
    }
    setExpanded((prev) => !prev);
  };

  return (
    <div
      className={`product-card${expanded ? " expanded" : ""}`}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <img src={product.image} alt={product.title} className="product-image" />
      <div className="product-info">
        <div className="product-title">{product.title}</div>
        <div className="category-stock">
          <span className="product-category">{product.category}</span>
          <span className="product-stock">Stock: {product.stock}</span>
        </div>
        <div className="price-rating">
          <span className="product-price">R {product.price.toFixed(2)}</span>
          <span className="product-rating">★ {product.rating || 0}</span>
        </div>
        {expanded && (
          <>
            <div className="product-description">{product.description}</div>
          </>
        )}
        {showAddToCart && (
          !loggedInUser ? (
            <button
              className="ghost-login-btn"
              style={{
                background: 'none',
                border: '1px solid #e1bb3e',
                color: '#9b1c23',
                borderRadius: 8,
                padding: '10px 0',
                width: '100%',
                fontWeight: 700,
                marginTop: 8,
                cursor: 'pointer'
              }}
              onClick={onLoginToBuy}
            >
              Login to buy
            </button>
          ) : (
            <button
              className="add-to-cart-btn"
              onClick={e => {
                e.stopPropagation(); // Prevent card expand/collapse when clicking button
                addToCart(product);
              }}
            >
              Add to Cart
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ProductCard;
