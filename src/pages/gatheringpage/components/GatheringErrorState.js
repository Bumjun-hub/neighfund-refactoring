import React from 'react';

const GatheringErrorState = ({ error, onRetry }) => {
  return (
    <div className="gathering-container">
      <div className="error-message">
        <p>{error}</p>
        <button onClick={onRetry} className="retry-button">
          다시 시도
        </button>
      </div>
    </div>
  );
};

export default GatheringErrorState;
