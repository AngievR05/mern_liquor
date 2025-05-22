import '../styles/SearchBar.css'; 

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 rounded-xl border border-gray-300"
      />
    </div>
  );
};

export default SearchBar;