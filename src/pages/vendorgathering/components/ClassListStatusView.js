import React from 'react';

const ClassListStatusView = ({ type, message, onRetry }) => {
  if (type === 'loading') {
    return (
      <div className="class-list-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="class-list-page">
      <div className="class-status class-status--error" role="alert">
        <p>{message}</p>
        <button type="button" className="class-retry-btn" onClick={onRetry}>
          다시 시도
        </button>
      </div>
    </div>
  );
};

export default ClassListStatusView;
