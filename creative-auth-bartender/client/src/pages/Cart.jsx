import React from 'react';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; // <-- import ProductCard
import '../styles/CartPage.css';

const getStoredUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    return user || null;
  } catch {
    return null;
  }
};

export default function Cart() {
  const loggedInUser = getStoredUser();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  if (!loggedInUser) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        color: '#9b1c23',
        fontWeight: 700
      }}>
        No items - please login to add products
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="empty-message">Your cart is empty. Head to the store to add some products!</p>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map(item => (
                <li key={item._id} className="cart-item" style={{ flexDirection: "column", alignItems: "stretch" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <ProductCard product={item} showAddToCart={false} />
                    <div className="cart-item-actions" style={{ minWidth: 120 }}>
                      <label>Qty:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                      />
                      <button onClick={() => removeFromCart(item._id)} className="remove-btn">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <h3>Total: R {total.toFixed(2)}</h3>
              <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
              <Link to="/checkout">
                <button className="checkout-btn">Proceed to Checkout</button>
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer className="cart-footer" />
    </div>
  );
};
