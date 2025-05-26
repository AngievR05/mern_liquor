import { useState } from 'react';
import '../styles/AddProductModal.css';


export default function AddProductModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    image: '',
  });

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      const fileData = new FormData();
      fileData.append('image', files[0]);
      const res = await fetch('/api/upload', { method: 'POST', body: fileData });
      const data = await res.json();
      setFormData(prev => ({ ...prev, image: data.filePath }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input name="title" value={formData.title} onChange={handleChange} required />

          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />

          <label>Price:</label>
          <input name="price" type="number" value={formData.price} onChange={handleChange} required />

          <label>Category:</label>
          <input name="category" value={formData.category} onChange={handleChange} />

          <label>Stock:</label>
          <input name="stock" type="number" value={formData.stock} onChange={handleChange} />

          <label>Image (upload to /uploads):</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />

          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
