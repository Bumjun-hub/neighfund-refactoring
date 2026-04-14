import React from 'react';

const VendorClassCard = ({ classData, onCardClick }) => {
  return (
    <div onClick={() => onCardClick(classData.id)} className="class-card">
      <div className="class-card-image">
        {classData.titleImage ? (
          <img src={classData.titleImage} alt={classData.title} />
        ) : (
          <div className="no-image">이미지 없음</div>
        )}
      </div>

      <div className="class-card-content">
        <div className="class-card-header">
          <h3 className="class-card-title">{classData.title}</h3>
          <span className="class-card-category">{classData.categoryKorean}</span>
        </div>

        <div className="class-card-info">
          <div className="class-card-info-item">
            <span className="label">상품:</span>
            <span className="value">{classData.productName}</span>
          </div>
          <div className="class-card-info-item">
            <span className="label">위치:</span>
            <span className="value">{classData.dongName}</span>
          </div>
          <div className="class-card-info-item">
            <span className="label">소요시간:</span>
            <span className="value">{classData.durationHours || '미정'}시간</span>
          </div>
          <div className="class-card-info-item">
            <span className="label">최대 인원:</span>
            <span className="value">{classData.maxParticipants || '미정'}명</span>
          </div>
        </div>

        <div className="class-card-description">
          <p>{classData.content}</p>
        </div>

        <div className="class-card-price">
          <span className="price">{classData.productPrice?.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
};

export default VendorClassCard;
