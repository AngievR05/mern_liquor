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
import Accordion from 'react-bootstrap/Accordion';

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
  const [activeFilterAccordion, setActiveFilterAccordion] = useState('0');

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
  const [seller, setSeller] = useState(null);
  const [activeTab, setActiveTab] = useState("home");

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
    } else if (priceSort === "a-z") {
      updated.sort((a, b) => a.title.localeCompare(b.title));
    }
    setFilteredProducts(updated);
  }, [searchQuery, categoryFilter, products, priceSort, priceRangeIdx]);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (user && user.isSeller) setSeller(user);
    } catch {}
  }, []);

  // Compute myProducts for seller
  const myProducts = seller
    ? filteredProducts.filter(p => p.seller === seller.username)
    : [];

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
          <Accordion
            activeKey={activeFilterAccordion}
            onSelect={setActiveFilterAccordion}
            className="category-filter-accordion"
            style={{ marginBottom: 8 }}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>Filter by Category</Accordion.Header>
              <Accordion.Body>
                <FilterPanel
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion
            activeKey={activeFilterAccordion}
            onSelect={setActiveFilterAccordion}
            className="price-filter-accordion"
            style={{
              marginBottom: 0,
              marginTop: 8,
              width: '100%',
              backgroundColor: '#000000',
              marginLeft: 0,
            }}
          >
            <Accordion.Item eventKey="1">
              <Accordion.Header>Filter by Price</Accordion.Header>
              <Accordion.Body>
                <PriceFilterPanel
                  priceSort={priceSort}
                  setPriceSort={setPriceSort}
                  priceRangeIdx={priceRangeIdx}
                  setPriceRangeIdx={setPriceRangeIdx}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          {/* Show Add Product button only for admin, or for seller when in My Store tab */}
          {(isAdmin || (seller && activeTab === "myStore")) && (
            <button
              className="store-add-product-btn"
              onClick={() => setShowAddProductModal(true)}
              style={{ marginTop: 16, width: '100%' }}
            >
              Add Product
            </button>
          )}
        </div>
        <div className="main-content">
          {/* Seller tab navigation */}
          {seller && (
            <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
              <button
                onClick={() => setActiveTab("home")}
                style={{
                  background: activeTab === "home" ? "#e1bb3e" : "#222",
                  color: activeTab === "home" ? "#350b0f" : "#e1bb3e",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 32px",
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: "pointer"
                }}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab("myStore")}
                style={{
                  background: activeTab === "myStore" ? "#e1bb3e" : "#222",
                  color: activeTab === "myStore" ? "#350b0f" : "#e1bb3e",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 32px",
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: "pointer"
                }}
              >
                My Store
              </button>
            </div>
          )}
          {/* Section Content */}
          {(!seller || activeTab === "home") ? (
            // Home tab: show the store as usual (buyer perspective)
            <div>
              <h2 style={{ color: "#e1bb3e", marginBottom: 24 }}>All Products</h2>
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
          ) : (
            // My Store tab: show only seller's products, admin-style cards
            <div>
              <h2 style={{ color: "#e1bb3e", marginBottom: 24 }}>My Store</h2>
              {myProducts.length === 0 ? (
                <div style={{ color: "#fff", fontSize: 20, marginTop: 32 }}>
                  My Store<br />You have no products listed yet.
                </div>
              ) : useMasonry ? (
                <Masonry
                  breakpointCols={breakpointCols}
                  className="product-grid"
                  columnClassName="product-grid-column"
                >
                  {myProducts.map((product) => (
                    <div key={product._id} className="product-wrapper">
                      <ProductCard product={product} onLoginToBuy={handleLoginToBuy} />
                      <div className="product-actions">
                        <button onClick={() => handleEditProduct(product)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">Delete</button>
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
                  {myProducts.map((product) => (
                    <div key={product._id} className="product-wrapper">
                      <ProductCard product={product} onLoginToBuy={handleLoginToBuy} />
                      <div className="product-actions">
                        <button onClick={() => handleEditProduct(product)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">Delete</button>
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
          )}
        </div>
        {/* <div className="right-sidebar">
          <PriceFilterPanel
            priceSort={priceSort}
            setPriceSort={setPriceSort}
            priceRangeIdx={priceRangeIdx}
            setPriceRangeIdx={setPriceRangeIdx}
          />
        </div> */}
      </div>

      {/* AddProductModal for admin and seller */}
      {(isAdmin || seller) && showAddProductModal && (
        <AddProductModal
          onClose={() => setShowAddProductModal(false)}
          onProductAdded={async (product) => {
            try {
              // If product is already an object with _id, just add it
              if (product && product._id) {
                setProducts(products => [...products, product]);
                setFilteredProducts(filtered => [...filtered, product]);
                return;
              }
              // Otherwise, POST to backend and handle response
              const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
              });
              if (!res.ok) {
                const err = await res.text();
                alert("Error adding product: " + err);
                return;
              }
              const newProduct = await res.json();
              setProducts(products => [...products, newProduct]);
              setFilteredProducts(filtered => [...filtered, newProduct]);
            } catch (err) {
              alert("Error adding product");
            }
          }}
          seller={seller}
          // Ensure you pass the correct user info for admin as well
          admin={isAdmin ? loggedInUser : undefined}
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
