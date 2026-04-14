import React from 'react';

const FundPageHeader = ({ isAdmin, onWriteClick, onSurveyWriteClick }) => {
  return (
    <div className="fund-header">
      <h2 className="fund-title">펀딩</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="write-btn" onClick={onWriteClick}>
          + 펀딩 글쓰기
        </button>
        {isAdmin && (
          <button className="write-btn" onClick={onSurveyWriteClick}>
            + 설문조사 글쓰기
          </button>
        )}
      </div>
    </div>
  );
};

export default FundPageHeader;
