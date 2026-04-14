import React from 'react';
import SuggestionCard from '../../../components/SuggestionCard';

const SuggestionListSection = ({ fetchStatus, filtered, onRetry, onEdit, onLike }) => {
  return (
    <div className="suggestion-list">
      {fetchStatus === 'loading' && (
        <div className="suggestion-status suggestion-status--loading" role="status">
          제안글을 불러오는 중입니다...
        </div>
      )}

      {fetchStatus === 'error' && (
        <div className="suggestion-status suggestion-status--error" role="alert">
          <p>제안글을 불러오지 못했습니다.</p>
          <button type="button" className="suggestion-retry-btn" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      )}

      {fetchStatus === 'ready' && filtered.length === 0 && (
        <div className="suggestion-status">등록된 제안글이 없습니다.</div>
      )}

      {fetchStatus === 'ready' &&
        filtered.map((item) => (
          <SuggestionCard
            key={item.id}
            post={item}
            size="large"
            onEdit={() => onEdit(item.id)}
            onLike={() => onLike(item.id)}
          />
        ))}
    </div>
  );
};

export default SuggestionListSection;
