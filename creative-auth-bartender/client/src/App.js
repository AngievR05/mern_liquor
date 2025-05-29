import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import GameAuth from './pages/GameScreen';
import GameSuccess from './pages/GameSuccess';
import GameFailure from './pages/GameFailure';
import AccessibilityLogin from './pages/AccessibilityLogin';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Store from './pages/Store';
import About from './pages/About';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/Cart'; // Use the CartPage component

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/game" element={<GameAuth />} />
        <Route path="/gamesuccess" element={<GameSuccess />} />
        <Route path="/gamefailure" element={<GameFailure />} />
        <Route path="/accessibility-login" element={<AccessibilityLogin />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/store" element={<Store />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}
