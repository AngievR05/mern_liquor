import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import ReviewsModal from '../components/ReviewsModal';
import AuthModal from '../components/AuthModal';
import AddProductModal from '../components/AddProductModal'; // If you have this component
import EditProductModal from '../components/EditProductModal'; // If you have this component
import PriceFilterPanel from '../components/PriceFilterPanel';
import '../styles/StorePage.css';
import '../styles/PriceFilterPanel.css';
import Masonry from 'react-masonry-css';
import priceRanges from '../constants/priceRanges'; // Assuming you have this constant defined

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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceSort, setPriceSort] = useState(""); // "low-high" | "high-low" | ""
  const [priceRangeIdx, setPriceRangeIdx] = useState(priceRanges.length - 1); // default to "All"

  // Add admin check
  const isAdmin = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      return user && user.isAdmin;
    } catch {
      return false;
    }
  })();

  // Add state for modals if not present
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

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
    // Price range filter
    const { min, max } = priceRanges[priceRangeIdx];
    if (priceRangeIdx !== priceRanges.length - 1) { // not "All"
      updated = updated.filter(p => p.price >= min && p.price < max);
    }
    // Price sort
    if (priceSort === "low-high") {
      updated.sort((a, b) => a.price - b.price);
    } else if (priceSort === "high-low") {
      updated.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(updated);
  }, [searchQuery, categoryFilter, products, priceSort, priceRangeIdx]);

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

  // Handler for ProductCard ghost button
  const handleLoginToBuy = () => setShowAuthModal(true);

  // Add product handler
  const handleAddProduct = () => setShowAddProductModal(true);

  // Edit product handler
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowEditProductModal(true);
  };

  // Delete product handler
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      setProducts(products => products.filter(p => p._id !== productId));
      setFilteredProducts(filtered => filtered.filter(p => p._id !== productId));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

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
          {/* Add Product button for admin */}
          {isAdmin && (
            <button
              className="store-add-product-btn"
              onClick={handleAddProduct}
              style={{ marginTop: 16 }}
            >
              Add Product
            </button>
          )}
        </div>
        <div className="main-content">
          {useMasonry ? (
            <Masonry
              breakpointCols={breakpointCols}
              className="product-grid"
              columnClassName="product-grid-column"
            >
              {filteredProducts.map((product) => (
                <div key={product._id} className="product-wrapper">
                  <ProductCard product={product} onLoginToBuy={handleLoginToBuy} />
                  <div className="product-actions">
                    {/* Admin-only Edit/Delete buttons */}
                    {isAdmin && (
                      <>
                        <button onClick={() => handleEditProduct(product)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">Delete</button>
                      </>
                    )}
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
                  <ProductCard product={product} onLoginToBuy={handleLoginToBuy} />
                  <div className="product-actions">
                    {/* Admin-only Edit/Delete buttons */}
                    {isAdmin && (
                      <>
                        <button onClick={() => handleEditProduct(product)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">Delete</button>
                      </>
                    )}
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
        <div className="right-sidebar">
          <PriceFilterPanel
            priceSort={priceSort}
            setPriceSort={setPriceSort}
            priceRangeIdx={priceRangeIdx}
            setPriceRangeIdx={setPriceRangeIdx}
          />
        </div>
      </div>

      {/* AddProductModal for admin */}
      {isAdmin && showAddProductModal && (
        <AddProductModal
          onClose={() => setShowAddProductModal(false)}
          onProductAdded={product => {
            setProducts(products => [...products, product]);
            setFilteredProducts(filtered => [...filtered, product]);
          }}
        />
      )}
      {/* EditProductModal for admin */}
      {isAdmin && showEditProductModal && editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setShowEditProductModal(false)}
          onProductUpdated={updatedProduct => {
            setProducts(products => products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
            setFilteredProducts(filtered => filtered.map(p => p._id === updatedProduct._id ? updatedProduct : p));
          }}
        />
      )}
      {showReviewsModal && (
        <ReviewsModal
          onClose={() => setShowReviewsModal(false)}
          reviews={selectedProduct ? selectedProduct.reviews : []}
          productName={selectedProduct ? selectedProduct.title : ''}
          productId={selectedProduct ? selectedProduct._id : undefined}
        />
      )}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      <Footer className="store-footer" />
    </div>
  );
};

export default Store;
