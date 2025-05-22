const categories = ['All', 'Beer', 'Wine', 'Whiskey'];

const FilterPanel = ({ categoryFilter, setCategoryFilter }) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Filter by Category</h2>
      <ul className="space-y-2">
        {categories.map(cat => (
          <li key={cat}>
            <button
              className={`px-3 py-1 rounded-xl text-sm w-full text-left ${
                categoryFilter === cat ? 'bg-primary text-white' : 'bg-gray-100'
              }`}
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