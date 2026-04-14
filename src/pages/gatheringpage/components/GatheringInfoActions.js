import React from 'react';

const GatheringInfoActions = ({ liked, likes, isMember, onLike, onJoin }) => {
  return (
    <div className="action-buttons">
      <button onClick={onLike} className={`like-button ${liked ? 'liked' : ''}`}>
        {liked ? '❤️' : '🤍'} 좋아요 ({likes})
      </button>

      {!isMember && (
        <button onClick={onJoin} className="join-button">
          소모임 참여하기
        </button>
      )}
    </div>
  );
};

export default GatheringInfoActions;
