import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import ProfileModal from '../components/ProfileModal';
import ReviewsModal from '../components/ReviewsModal';
import '../styles/StorePage.css';
import Masonry from 'react-masonry-css';

const Store = () => {
  const getStoredUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      return user || null;
    } catch {
      return null;
    }
  };
  const getStoredProfilePic = () => {
    try {
      return localStorage.getItem('profilePic') || null;
    } catch {
      return null;
    }
  };
  const loggedInUser = getStoredUser();
  const profilePic = getStoredProfilePic();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
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
      updated = updated.filter(
        p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
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

  const breakpointCols = {
    default: 4,
    1920: 3,
    1100: 2,
    700: 1
  };

  function getCurrentCols() {
    const width = window.innerWidth;
    if (width <= 700) return 1;
    if (width <= 1100) return 2;
    if (width <= 1920) return 3;
    return 4;
  }

  const [currentCols, setCurrentCols] = useState(getCurrentCols());

  useEffect(() => {
    const handleResize = () => setCurrentCols(getCurrentCols());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const useMasonry = filteredProducts.length > currentCols;

  return (
    <div className="store-page">
      <div className="store-layout">
        <div className="sidebar">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            products={products}
            setFilteredProducts={setFilteredProducts}
          />
          <FilterPanel categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} className="filter-panel" />
          <button
            className="store-add-product-btn"
            onClick={() => setShowAddModal(true)}
          >
            Add Product
          </button>
        </div>

        {useMasonry ? (
          <Masonry
            breakpointCols={breakpointCols}
            className="product-grid"
            columnClassName="product-grid-column"
          >
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-wrapper">
                <ProductCard product={product} />
                <div className="product-actions">
                  <button
                    onClick={() => { setSelectedProduct(product); setShowEditModal(true); }}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => { setSelectedProduct(product); setShowReviewsModal(true); }}
                    className="reviews-button"
                  >
                    Reviews
                  </button>
                </div>
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="product-grid normal-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-wrapper">
                <ProductCard product={product} />
                <div className="product-actions">
                  <button
                    onClick={() => { setSelectedProduct(product); setShowEditModal(true); }}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => { setSelectedProduct(product); setShowReviewsModal(true); }}
                    className="reviews-button"
                  >
                    Reviews
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onSave={handleAddProduct} />}
      {showEditModal && <EditProductModal product={selectedProduct} onClose={() => setShowEditModal(false)} onSave={handleEditProduct} />}
      {showProfileModal && loggedInUser && (
        <ProfileModal
          user={loggedInUser}
          onClose={() => setShowProfileModal(false)}
          onLogout={() => {
            setShowProfileModal(false);
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('profilePic');
            window.location.reload();
          }}
          onProfilePicChange={(url) => {
            localStorage.setItem('profilePic', url);
          }}
        />
      )}
      {showReviewsModal && (
        <ReviewsModal
          onClose={() => setShowReviewsModal(false)}
          reviews={selectedProduct ? selectedProduct.reviews : []}
          productName={selectedProduct ? selectedProduct.title : ''}
        />
      )}
      <Footer className="store-footer" />
    </div>
  );
};

export default Store;
