import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import '../styles/StorePage.css';
import Navbar from '../components/Navbar';

const staticProducts = [
  {
    _id: '1',
    title: 'Vintage Red Wine',
    image: '/images/red-wine.jpg',
    price: 25.99,
    category: 'Wine',
    description: 'A bold, rich red wine with fruity undertones.',
    stock: 12,
    rating: 4.5,
    comments: [],
    likes: 3,
  },
  {
    _id: '2',
    title: 'Craft Beer IPA',
    image: '/images/ipa.jpg',
    price: 8.49,
    category: 'Beer',
    description: 'A hoppy and refreshing craft IPA.',
    stock: 30,
    rating: 4.2,
    comments: [],
    likes: 6,
  },
  {
    _id: '3',
    title: 'Single Malt Whiskey',
    image: '/images/whiskey.jpg',
    price: 45.00,
    category: 'Whiskey',
    description: 'Smooth and smoky single malt whiskey.',
    stock: 10,
    rating: 4.7,
    comments: [],
    likes: 5,
  },
];

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAdmin, setIsAdmin] = useState(false); // Simulated admin check

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.warn('Using static fallback products.');
        setProducts(staticProducts);
        setFilteredProducts(staticProducts);
      }
    };

    fetchProducts();

    // Simulate checking user role (use actual auth context/token in production)
    const userRole = localStorage.getItem('role'); // Example: 'admin' or 'user'
    if (userRole === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    let updated = [...products];
    if (categoryFilter !== 'All') {
      updated = updated.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (searchQuery) {
      updated = updated.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(updated);
  }, [searchQuery, categoryFilter, products]);

  const handleLike = (productId) => {
    const updated = products.map(p => {
      if (p._id === productId) {
        return { ...p, likes: (p.likes || 0) + 1 };
      }
      return p;
    });
    setProducts(updated);
  };

  const handleComment = (productId, comment) => {
    const updated = products.map(p => {
      if (p._id === productId) {
        return {
          ...p,
          comments: [...(p.comments || []), comment],
        };
      }
      return p;
    });
    setProducts(updated);
  };

  const handleDelete = (productId) => {
    const updated = products.filter(p => p._id !== productId);
    setProducts(updated);
  };

  return (
    <div className="store-page">
      <Navbar />
      <div className="store-container">
        <div className="store-header">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <div className="store-main">
          <FilterPanel categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                isAdmin={isAdmin}
                onLike={handleLike}
                onComment={handleComment}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
