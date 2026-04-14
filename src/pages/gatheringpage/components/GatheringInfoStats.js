import React from 'react';

const GatheringInfoStats = ({ memberCount, likes, createdAt }) => {
  return (
    <div className="gathering-stats">
      <div className="stat-item">
        <span className="stat-label">참여자</span>
        <span className="stat-value">{memberCount}명</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">좋아요</span>
        <span className="stat-value">{likes}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">생성일</span>
        <span className="stat-value">{createdAt}</span>
      </div>
    </div>
  );
};

export default GatheringInfoStats;
