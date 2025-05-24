import '../styles/SearchBar.css';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Optional button, e.g., clear or submit */}
      {/* <button>Search</button> */}
    </div>
  );
};

export default SearchBar;
