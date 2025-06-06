import React from 'react';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
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
        No items – please log in to add products.
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
                    <img
                      src={item.image.startsWith('/uploads') ? process.env.PUBLIC_URL + item.image : item.image}
                      alt={item.title}
                      className="cart-item-image"
                    />
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
}
