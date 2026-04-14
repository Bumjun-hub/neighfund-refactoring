import React from 'react';

const FundTabContent = ({ activeTab, fund }) => {
  return (
    <div className="fund-main-left">
      {activeTab === 'intro' && (
        <div className="fund-description-box">
          {fund.content?.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
          {fund.contentImgUrls?.map((url, idx) => (
            <img key={idx} src={url} alt={`본문 이미지 ${idx + 1}`} className="fund-content-image" />
          ))}
        </div>
      )}
      {activeTab === 'budget' && (
        <div className="fund-description-box">
          <p>
            이 펀딩의 목표 금액은 <strong>{fund.targetAmount.toLocaleString()}원</strong>이며, 펀딩 금액은 제작비,
            홍보비, 기부금 등으로 사용됩니다.
          </p>
        </div>
      )}
      {activeTab === 'schedule' && (
        <div className="fund-description-box">
          <p>📌 등록일: {fund.createdAt?.split('T')[0]}</p>
          <p>📌 마감일: {fund.deadline?.split('T')[0]}</p>
          <p>📦 리워드 발송 예정일: 추후 공지</p>
        </div>
      )}
    </div>
  );
};

export default FundTabContent;
