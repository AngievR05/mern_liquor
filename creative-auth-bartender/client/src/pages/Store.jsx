import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/StorePage.css';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.warn('Using static products fallback');
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
          },
          {
            _id: '3',
            title: 'Single Malt Whiskey',
            image: '/images/whiskey.jpg',
            price: 45.0,
            category: 'Whiskey',
            description: 'Smooth and smoky single malt whiskey.',
            stock: 10,
            rating: 4.7,
          },
          {
            _id: '4',
            title: 'Rosé Summer Blush',
            image: '/images/rose.jpg',
            price: 19.99,
            category: 'Wine',
            description: 'Crisp and floral, perfect for warm evenings.',
            stock: 15,
            rating: 4.3,
          },
          {
            _id: '5',
            title: 'Stout Imperial Dark',
            image: '/images/stout.jpg',
            price: 9.5,
            category: 'Beer',
            description: 'Dark and intense with chocolate notes.',
            stock: 20,
            rating: 4.1,
          },
        ];
        setProducts(staticProducts);
        setFilteredProducts(staticProducts);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let updated = [...products];
    if (categoryFilter !== 'All') {
      updated = updated.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (searchQuery) {
      updated = updated.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredProducts(updated);
  }, [searchQuery, categoryFilter, products]);

  return (
    <div className="store-page">
      <Navbar />
      <div className="store-layout">
        <div className="sidebar">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <FilterPanel categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Store;
