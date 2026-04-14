import React from 'react';
import { formatDate, getCategoryText, getImageUrl } from './gatheringFormatters';

const GatheringCard = ({ gathering, onCardClick, onLike }) => {
  return (
    <div className="gathering-card" onClick={() => onCardClick(gathering.id)}>
      <div className="card-image">
        <img
          src={getImageUrl(gathering.titleImage)}
          alt={gathering.title}
          onError={(e) => {
            e.target.src = '/images/noImage.png';
          }}
        />
        <span className="category-tag">{getCategoryText(gathering.category)}</span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{gathering.title}</h3>
        <p className="card-description">{gathering.content}</p>
        <p className="card-location">📍 {gathering.dongName}</p>

        <div className="card-footer">
          <div className="card-stats">
            <span
              className={`likes ${gathering.liked ? 'liked' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onLike(gathering.id);
              }}
              style={{ cursor: 'pointer' }}
            >
              {gathering.liked ? '❤️' : '🤍'} {gathering.likes || 0}
            </span>
            <span className="members">👥 {gathering.memberCount || 0}</span>
          </div>
          <div className="card-date">{formatDate(gathering.createdAt)}</div>
        </div>
      </div>
    </div>
  );
};

export default GatheringCard;
