import '../styles/FilterPanel.css';

const categories = ['All', 'Beer', 'Wine', 'Whiskey'];

const FilterPanel = ({ categoryFilter, setCategoryFilter }) => {
  return (
    <div className="filter-panel">
      <h2 className="filter-title">Filter by Category</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat} className="filter-option">
            <button
              className={`category-button ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterPanel;
