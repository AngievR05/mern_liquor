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

  const handleAddProduct = (newProduct) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
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
            <div key={product._id} className="product-wrapper">
              <ProductCard product={product} />
              <div className="product-actions">
                <button onClick={() => { setSelectedProduct(product); setShowEditModal(true); }}>Edit</button>
                <button onClick={() => handleDeleteProduct(product._id)} className="delete-button">Delete</button>
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
