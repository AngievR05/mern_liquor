import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import '../styles/StorePage.css';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let updated = [...products];
    if (categoryFilter !== 'All') {
      updated = updated.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (searchQuery) {
      updated = updated.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredProducts(updated);
  }, [searchQuery, categoryFilter, products]);

  const handleAddProduct = async (newProduct) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      setProducts(prev => [...prev, data]);
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const handleEditProduct = async (updatedProduct) => {
    try {
      const res = await fetch(`/api/products/${updatedProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();
      setProducts(prev => prev.map(p => p._id === data._id ? data : p));
    } catch (err) {
      console.error('Failed to edit product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  return (
    <div className="store-page">
      <Navbar />
      <div className="store-layout">
        <div className="sidebar">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <FilterPanel categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
          <button onClick={() => setShowAddModal(true)} style={{ margin: '10px' }}>Add Product</button>
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} style={{ position: 'relative' }}>
              <ProductCard product={product} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                <button onClick={() => { setSelectedProduct(product); setShowEditModal(true); }}>Edit</button>
                <button onClick={() => handleDeleteProduct(product._id)} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onSave={handleAddProduct} />}
      {showEditModal && <EditProductModal product={selectedProduct} onClose={() => setShowEditModal(false)} onSave={handleEditProduct} />}
      <Footer />
    </div>
  );
};

export default Store;
