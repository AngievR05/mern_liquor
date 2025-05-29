import React, { useState } from 'react';
import '../styles/ProductCard.css';
import { useCart } from '../context/CartContext';
import ReviewForm from './ReviewForm';
import ReviewsModal from './ReviewsModal';

const ProductCard = ({ product }) => {
  const [expanded, setExpanded] = useState(false);
  const [productData, setProductData] = useState(product);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
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

  const renderStars = (count) => (
    <span className="review-stars">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ color: '#e1bb3e', fontSize: '1.2em', marginRight: '2px' }}>★</span>
      ))}
    </span>
  );

  return (
    <div
      className={`product-card${expanded ? ' expanded' : ''}`}
      onClick={handleToggle}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={productData.image}
        alt={productData.title}
        className={`product-image${expanded ? ' expanded' : ''}`}
      />
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
            <div className="category-stock">
            <p className="product-category">Category: {productData.category}</p>
            <p className="product-stock">Stock: {productData.stock}</p>
            </div>

            <h4>Reviews:</h4>
            <div className="review-list">
              {(productData.reviews || []).slice(0, 2).map((r, i, arr) => (
                <React.Fragment key={i}>
                  <div className="review-item">
                    <span className="review-user">{r.user}</span>
                    {renderStars(r.rating)}
                    <div className="review-content">{r.comment}</div>
                  </div>
                  {i < arr.length - 1 && <hr className="review-divider" />}
                </React.Fragment>
              ))}
            </div>
            {(productData.reviews?.length > 2) && (
              <button
                className="view-reviews-btn"
                onClick={(e) => { e.stopPropagation(); setShowReviewsModal(true); }}
              >
                View Reviews
              </button>
            )}

            <ReviewForm productId={productData._id} onReviewSubmit={handleReviewSubmit} />
          </div>
        )}
      </div>

      {showReviewsModal && (
        <ReviewsModal
          onClose={() => setShowReviewsModal(false)}
          reviews={productData.reviews}
          productName={productData.title}
        />
      )}
    </div>
  );
};

export default ProductCard;
