import { useCart } from '../context/CartContext';
import '../styles/CartPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom'; // ✅ Import Link

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <Navbar />
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

export default Cart; 
