import React from 'react';

const GatheringResultStates = ({
  searchKeyword,
  selectedCategory,
  displayCount,
  isLoading,
  hasMore,
  totalGatheringCount,
  hasError,
}) => {
  return (
    <>
      {(searchKeyword || selectedCategory) && displayCount === 0 && !isLoading && (
        <div className="no-results-message">
          <div className="no-results-content">
            <span className="no-results-icon">🔍</span>
            <h3>검색 결과가 없습니다</h3>
            <p>'{searchKeyword}'에 대한 검색 결과를 찾을 수 없습니다.</p>
            <p>다른 키워드나 카테고리로 시도해보세요!</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>새로운 모임을 불러오는 중...</p>
        </div>
      )}

      {!hasMore && !isLoading && displayCount > 0 && (
        <div className="end-message">
          <p>모든 모임을 확인했습니다! 🎉</p>
        </div>
      )}

      {!isLoading && totalGatheringCount === 0 && !hasError && (
        <div className="empty-message">
          <p>아직 등록된 소모임이 없습니다.</p>
          <p>첫 번째 소모임을 만들어보세요! 🎯</p>
        </div>
      )}
    </>
  );
};

export default GatheringResultStates;
