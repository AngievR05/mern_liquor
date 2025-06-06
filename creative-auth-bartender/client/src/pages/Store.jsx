import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import ReviewsModal from '../components/ReviewsModal';
import AuthModal from '../components/AuthModal';
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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
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
          {/* Remove Add Product button */}
        </div>

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
                  {/* Remove Edit and Delete buttons */}
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
                  {/* Remove Edit and Delete buttons */}
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

      {/* Remove AddProductModal and EditProductModal */}
      {showReviewsModal && (
        <ReviewsModal
          onClose={() => setShowReviewsModal(false)}
          reviews={selectedProduct ? selectedProduct.reviews : []}
          productName={selectedProduct ? selectedProduct.title : ''}
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
