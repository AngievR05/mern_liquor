import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item._id}>
                <strong>{item.title}</strong> - R {item.price.toFixed(2)} x {item.quantity}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                />
                <button onClick={() => removeFromCart(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: R {total.toFixed(2)}</h3>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
};

export default CartPage;
