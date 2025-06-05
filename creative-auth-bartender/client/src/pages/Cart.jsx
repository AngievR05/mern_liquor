import React from 'react';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom'; // ✅ Import Link
import '../styles/CartPage.css';

export default function Cart() {
  const loggedInUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('loggedInUser'));
    } catch {
      return null;
    }
  })();

  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  if (!loggedInUser) {
    return (
      <div>
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          color: '#9b1c23',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          <p>Missing your items?<br />Login to see your next order</p>
        </div>
        <Footer />
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
                <li key={item._id} className="cart-item">
                  <div className="cart-item-info">
                    <img src={item.image} alt={item.title} className="cart-item-image" />
                    <div>
                      <strong>{item.title}</strong>
                      <p>R {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <label>Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                    />
                    <button onClick={() => removeFromCart(item._id)} className="remove-btn">Remove</button>
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
