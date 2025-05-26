import { useState } from 'react';
import '../styles/AddProductModal.css';

export default function AddProductModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '', description: '', price: 0, category: '', stock: 0, image: ''
  });

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      const data = new FormData();
      data.append('image', files[0]);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const file = await res.json();
      setFormData(prev => ({ ...prev, image: file.filePath }));
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Backend error:', errorData);
      alert(`Error: ${errorData.message}`);
      return;
    }

    const saved = await res.json();
    onSave(saved);
    onClose();
  } catch (err) {
    console.error('Add failed:', err);
    alert('Error adding product');
  }
};


  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <label>Title:</label><input name="title" onChange={handleChange} />
          <label>Description:</label><textarea name="description" onChange={handleChange} />
          <label>Price:</label><input name="price" type="number" onChange={handleChange} />
          <label>Category:</label><input name="category" onChange={handleChange} />
          <label>Stock:</label><input name="stock" type="number" onChange={handleChange} />
          <label>Image:</label><input type="file" name="image" accept="image/*" onChange={handleChange} />
          <div className="edit-buttons">
            <button type="submit">Save</button><button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
