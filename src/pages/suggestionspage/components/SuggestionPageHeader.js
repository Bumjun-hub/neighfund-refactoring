import React from 'react';
import { SUGGESTION_CATEGORY_MAP } from './suggestionConstants';

const SuggestionPageHeader = ({
  sortType,
  categoryFilter,
  onSortTypeChange,
  onCategoryFilterChange,
  onWrite,
}) => {
  return (
    <div className="suggestion-header">
      <div className="suggestion-title">
        <h2>제안</h2>
      </div>
      <div className="filters">
        <select value={sortType} onChange={(e) => onSortTypeChange(e.target.value)}>
          <option value="최신순">최신순</option>
          <option value="공감순">공감순</option>
        </select>
        <select value={categoryFilter} onChange={(e) => onCategoryFilterChange(e.target.value)}>
          <option value="전체">전체</option>
          {Object.keys(SUGGESTION_CATEGORY_MAP).map((key) => (
            <option key={key} value={key}>
              {SUGGESTION_CATEGORY_MAP[key]}
            </option>
          ))}
        </select>
        <button className="suggestion-write-button" onClick={onWrite}>
          제안 글쓰기
        </button>
      </div>
    </div>
  );
};

export default SuggestionPageHeader;
