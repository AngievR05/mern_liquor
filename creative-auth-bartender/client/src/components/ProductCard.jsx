import React, { useState } from 'react';
import '../styles/ProductCard.css';
import EditProductModal from '../components/EditProductModal';

const ProductCard = ({ product, isAdmin, onLike, onComment, onDelete, onEdit }) => {
  const [commentText, setCommentText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentText.trim() !== '') {
      onComment(product._id, commentText.trim());
      setCommentText('');
    }
  };

  // Called when modal saves
  const handleSave = (updatedProduct) => {
    if (onEdit) {
      onEdit(updatedProduct); // Pass updated product up for actual update logic
    }
    setIsModalOpen(false); // Close modal after save
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        {product.stock !== undefined && <p className="product-stock">Stock: {product.stock}</p>}
        {product.rating && <p className="product-rating">⭐ {product.rating}</p>}

        <div className="product-actions">
          <button className="like-button" onClick={() => onLike(product._id)}>❤️ {product.likes || 0}</button>
        </div>

        <form onSubmit={handleSubmitComment} className="comment-form">
          <input
            type="text"
            placeholder="Add a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>

        {product.comments && product.comments.length > 0 && (
          <div className="comment-list">
            {product.comments.map((c, i) => (
              <p key={i} className="comment-item">💬 {c}</p>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="admin-controls">
            <button className="delete-button" onClick={() => onDelete(product._id)}>🗑️ Delete</button>
            <button 
              className="edit-button" 
              onClick={() => setIsModalOpen(true)}
            >
              ✏️ Edit
            </button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {isModalOpen && (
        <EditProductModal 
          product={product} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProductCard;
