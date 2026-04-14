import React from 'react';

const GatheringInfoStateView = ({ type, message }) => {
  if (type === 'loading') {
    return (
      <div className="gathering-info-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="gathering-info-container">
      <div className="error">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default GatheringInfoStateView;
