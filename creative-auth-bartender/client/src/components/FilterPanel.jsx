import '../styles/FilterPanel.css';

const categories = [
  'All',
  'Beer',
  'Red Wine',
  'White Wine',
  'Rose',
  'Whiskey',
  'Bourbon',
  'Scotch',
  'Brandy',
  'Cognac',
  'Vodka',
  'Tequila',
  'Rum',
  'Gin',
  'Liqueurs'
];

const FilterPanel = ({ categoryFilter, setCategoryFilter }) => {
  return (
    <div className="filter-panel">
      <h2 className="filter-title">Filter by Category</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat} className="filter-option">
            <button
              type="button"
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
