import React, { useState } from 'react';
import '../styles/ProductCard.css';
import { useCart } from '../context/CartContext';
import ReviewForm from './ReviewForm';

const ProductCard = ({ product }) => {
  const [expanded, setExpanded] = useState(false);
  const [productData, setProductData] = useState(product);
  const { addToCart } = useCart();

  const handleToggle = () => setExpanded(!expanded);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/products/${productData._id}/like`, { method: 'PATCH' });
      const updated = await res.json();
      setProductData(updated);
    } catch (err) {
      console.error('Error liking product:', err);
      alert('Error liking product');
    }
  };

  const handleReviewSubmit = (updatedProduct) => {
    setProductData(updatedProduct);
  };

  return (
    <div className="product-card" onClick={handleToggle} style={{ cursor: 'pointer' }}>
      <img src={productData.image} alt={productData.title} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{productData.title}</h3>
        <p className="product-price">R {productData.price.toFixed(2)}</p>
        <div className="rating-likes">
        <p className="product-rating">⭐ {productData.averageRating?.toFixed(2) || 0}</p>
        <p className="product-likes">❤️ {productData.likes || 0} Likes</p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); addToCart(productData); }}
          className="add-to-cart-btn"
        >
          Add to Cart
        </button>

        <button onClick={handleLike} className="like-btn">
          Like ❤️
        </button>

        {expanded && (
          <div className="product-extra" onClick={(e) => e.stopPropagation()}>
            <p className="product-description">{productData.description}</p>
            <p className="product-category">Category: {productData.category}</p>
            <p className="product-stock">Stock: {productData.stock}</p>

            <h4>Reviews:</h4>
            <ul>
              {productData.reviews?.map((r, i) => (
                <li key={i}>⭐ {r.rating} - {r.comment} (by {r.user})</li>
              ))}
            </ul>

            <ReviewForm productId={productData._id} onReviewSubmit={handleReviewSubmit} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
