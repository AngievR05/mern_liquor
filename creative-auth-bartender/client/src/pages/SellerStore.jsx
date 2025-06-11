import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import Footer from "../components/Footer";
import ReviewsModal from "../components/ReviewsModal"; // <-- Add this import

export default function SellerStore() {
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Get logged-in seller info
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (user && user.isSeller) {
        setSeller(user);
      } else {
        window.location.href = "/become-seller";
      }
    } catch {
      window.location.href = "/become-seller";
    }
  }, []);

  // Fetch only this seller's products
  useEffect(() => {
    if (!seller) return;
    async function fetchSellerProducts() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?seller=${encodeURIComponent(seller.username)}`
        );
        const data = await res.json();
        // Filter in case backend returns extra products
        setProducts(data.filter(
          p => p.seller && p.seller.toLowerCase() === seller.username.toLowerCase()
        ));
      } catch {
        setProducts([]);
      }
      setLoading(false);
    }
    fetchSellerProducts();
  }, [seller]);

  // Add product handler
  const handleProductAdded = (product) => {
    setProducts((prev) => [...prev, product]);
    setShowAddProductModal(false);
  };

  // Edit product handler
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowEditProductModal(true);
  };

  // Update product after edit
  const handleProductUpdated = (updatedProduct) => {
    setProducts((products) =>
      products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    setShowEditProductModal(false);
    setEditProduct(null);
  };

  // Delete product handler
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${productId}`, { method: "DELETE" });
      setProducts((products) => products.filter((p) => p._id !== productId));
    } catch {
      alert("Failed to delete product");
    }
  };

  if (!seller) {
    return null;
  }

  return (
    <div
      style={{
        padding: 32,
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: '"Merriweather", serif',
      }}
    >
      <h2
        style={{
          color: "#e1bb3e",
          marginBottom: 32,
          fontWeight: 800,
          fontSize: 36,
          letterSpacing: 1,
          textShadow: "0 2px 12px #000",
        }}
      >
        My Store
      </h2>
      <div style={{ marginBottom: 32 }}>
        <button
          style={{
            background:
              "linear-gradient(90deg, #e1bb3e 60%, #e35537 100%)",
            color: "#350b0f",
            border: "none",
            borderRadius: 8,
            padding: "14px 32px",
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
            boxShadow:
              "inset 3px 3px 5px #2a070b25, inset -3px -3px 5px #2a070b25",
            marginBottom: 16,
          }}
          onClick={() => setShowAddProductModal(true)}
        >
          Add Product
        </button>
      </div>
      <div>
        {loading ? (
          <div
            style={{
              color: "#e1bb3e",
              fontWeight: 700,
              fontSize: 22,
              textAlign: "center",
              marginTop: 80,
            }}
          >
            Loading your products...
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              color: "#e1bb3e",
              fontWeight: 700,
              fontSize: 22,
              textAlign: "center",
              marginTop: 80,
            }}
          >
            No products yet. Click "Add Product" to get started!
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              justifyContent: "center",
            }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                className="product-wrapper"
                style={{
                  background: "#181818",
                  borderRadius: 14,
                  boxShadow: "0 2px 8px #000a",
                  padding: 8,
                  width: "calc(25% - 16px)",
                  position: "relative",
                }}
              >
                <ProductCard
                  product={product}
                  showDescription
                  showAddToCart={false}
                />
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 10,
                    justifyContent: "center",
                  }}
                >
                  <button
                    style={{
                      background: "#e1bb3e",
                      color: "#350b0f",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 18px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      background: "#9b1c23",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 18px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                  <button
                    style={{
                      background: "linear-gradient(90deg, #e1bb3e 60%, #e35537 100%)",
                      color: "#350b0f",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 18px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowReviewsModal(true);
                    }}
                  >
                    Reviews
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showAddProductModal && (
        <AddProductModal
          onClose={() => setShowAddProductModal(false)}
          onSave={handleProductAdded}
        />
      )}
      {showEditProductModal && editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setShowEditProductModal(false)}
          onProductUpdated={handleProductUpdated}
        />
      )}
      {/* Reviews Modal */}
      {showReviewsModal && (
        <ReviewsModal
          onClose={() => setShowReviewsModal(false)}
          reviews={selectedProduct ? selectedProduct.reviews : []}
          productName={selectedProduct ? selectedProduct.title : ""}
          productId={selectedProduct ? selectedProduct._id : undefined}
        />
      )}
      <Footer />
    </div>
  );
}
