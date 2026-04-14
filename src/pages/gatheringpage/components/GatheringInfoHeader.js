import React from 'react';

const GatheringInfoHeader = ({ gathering, categoryColor, categoryText }) => {
  return (
    <>
      {gathering.titleImage && (
        <div className="title-image-container">
          <img src={gathering.titleImage} alt={gathering.title} className="title-image" />
        </div>
      )}

      <div className="gathering-header">
        <span className="category-badge" style={{ backgroundColor: categoryColor }}>
          {categoryText}
        </span>
        <h1 className="gathering-title">{gathering.title}</h1>
        <p className="dong-name">📍 {gathering.dongName}</p>
      </div>
    </>
  );
};

export default GatheringInfoHeader;
