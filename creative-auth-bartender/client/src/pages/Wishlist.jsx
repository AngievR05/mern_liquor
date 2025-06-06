import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      setWishlist(JSON.parse(localStorage.getItem('wishlist')) || []);
    } catch {
      setWishlist([]);
    }
  }, []);

  // Remove product from wishlist state when unhearted or added to cart
  const handleWishlistChange = (productId, isWishlisted) => {
    if (!isWishlisted) {
      setWishlist(prev => prev.filter(item => item._id !== productId));
    }
  };

  // Remove product from wishlist when added to cart
  const handleAddToCartAndRemove = (product) => {
    // Remove from wishlist in localStorage
    let wishlistArr = [];
    try {
      wishlistArr = JSON.parse(localStorage.getItem('wishlist')) || [];
    } catch {}
    wishlistArr = wishlistArr.filter(item => item._id !== product._id);
    localStorage.setItem('wishlist', JSON.stringify(wishlistArr));
    setWishlist(wishlistArr);
  };

  if (!wishlist.length) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#9b1c23', fontWeight: 700 }}>
        No products in your wishlist.
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: "#9b1c23", marginBottom: 24 }}>My Wishlist</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {wishlist.map(product => (
          <div key={product._id} className="product-wrapper">
            <ProductCard
              product={product}
              showDescription
              onWishlistChange={handleWishlistChange}
              showAddToCart={true}
              onAddToCartFromWishlist={handleAddToCartAndRemove}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
