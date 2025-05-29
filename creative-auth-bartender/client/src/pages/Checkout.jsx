import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/CheckoutPage.css'; 

const Checkout = () => {
  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <h2>Checkout</h2>
        <p>Thank you for your purchase!</p>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
