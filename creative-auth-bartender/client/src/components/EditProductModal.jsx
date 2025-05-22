import { useState } from 'react';
import '../styles/EditProductModal.css';

const EditProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...product });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h2>Edit Product</h2>
        <label>Title:</label>
        <input name="title" value={formData.title} onChange={handleChange} />
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
        <label>Price:</label>
        <input name="price" type="number" value={formData.price} onChange={handleChange} />
        <label>Category:</label>
        <input name="category" value={formData.category} onChange={handleChange} />
        <label>Stock:</label>
        <input name="stock" type="number" value={formData.stock} onChange={handleChange} />
        <div className="edit-buttons">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
