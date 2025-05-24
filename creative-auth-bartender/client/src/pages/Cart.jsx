import React from 'react';
import '../styles/Cart.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = ({ cartItems, onRemove, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                  <img src={item.image} alt={item.title} />
                  <div>
                    <h4>{item.title}</h4>
                    <p>${item.price.toFixed(2)}</p>
                    <button onClick={() => onRemove(index)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-summary">
              <h3>Total: ${total.toFixed(2)}</h3>
              <button onClick={onCheckout}>Checkout</button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
