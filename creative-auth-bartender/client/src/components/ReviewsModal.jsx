// ReviewsModal.jsx
import React from "react";
import ReactDOM from "react-dom";

const ReviewsModal = ({ onClose, reviews = [], productName }) => (
  ReactDOM.createPortal(
    <div className="reviews-modal-overlay" onClick={onClose}>
      <div className="reviews-modal" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>×</button>
        <h3>{productName} Reviews</h3>
        <div className="all-reviews-list">
          {reviews.length === 0 && <div>No reviews yet.</div>}
          {reviews.map((r, i, arr) => (
            <React.Fragment key={i}>
              <div className="modal-review-row">
                <span className="review-user">{r.user}</span>
                <div className="modal-review-stars">{renderStars(r.rating)}</div>
                <div className="modal-review-divider"></div>
                <div className="modal-review-content">{r.comment}</div>
              </div>
              {i < arr.length - 1 && <hr className="review-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
);

const renderStars = (count) => (
  <span className="review-stars">
    {Array.from({ length: count }, (_, i) => (
      <span key={i} style={{ color: '#e1bb3e', fontSize: '1.2em', marginRight: '2px' }}>★</span>
    ))}
  </span>
);

export default ReviewsModal;