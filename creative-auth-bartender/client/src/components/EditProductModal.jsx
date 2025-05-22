import { useState } from 'react';
import '../styles/EditProductModal.css';

const EditProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...product });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value // keep numbers numeric
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
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
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
