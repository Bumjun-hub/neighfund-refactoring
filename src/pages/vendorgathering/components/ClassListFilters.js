import React from 'react';

const ClassListFilters = ({
  searchTerm,
  onSearchTermChange,
  categoryFilter,
  onCategoryFilterChange,
  locationFilter,
  onLocationFilterChange,
  categories,
  locations,
}) => {
  return (
    <div className="filter-section">
      <div className="search-container">
        <input
          type="text"
          placeholder="클래스명 또는 강사명으로 검색..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-container">
        <select value={categoryFilter} onChange={(e) => onCategoryFilterChange(e.target.value)} className="filter-select">
          <option value="ALL">모든 카테고리</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <select value={locationFilter} onChange={(e) => onLocationFilterChange(e.target.value)} className="filter-select">
          <option value="ALL">모든 지역</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ClassListFilters;
