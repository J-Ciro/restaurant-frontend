/**
 * Componente de Filtros para el Dashboard de Cocina
 */
function KitchenFilters({ filter, onFilterChange }) {
  const filters = [
    { value: '', label: 'All' },
    { value: 'RECEIVED', label: 'Received' },
    { value: 'PREPARING', label: 'Preparing' },
    { value: 'READY', label: 'Ready' },
  ];

  return (
    <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap">
      {filters.map((filterOption) => (
        <button
          key={filterOption.value}
          onClick={() => onFilterChange(filterOption.value)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            filter === filterOption.value
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {filterOption.label}
        </button>
      ))}
    </div>
  );
}

export default KitchenFilters;

