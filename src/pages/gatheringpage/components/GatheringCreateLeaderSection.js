import React from 'react';

const GatheringCreateLeaderSection = ({ isEditMode, formData, onInputChange }) => {
  if (isEditMode) return null;

  return (
    <div className="form-section">
      <h2 className="section-title">리더 정보</h2>

      <div className="form-group">
        <label htmlFor="nickname">소모임 닉네임 *</label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          value={formData.nickname}
          onChange={onInputChange}
          placeholder="소모임에서 사용할 닉네임"
          maxLength={20}
        />
        <span className="char-count-gathering">{formData.nickname.length}/20</span>
      </div>

      <div className="form-group">
        <label htmlFor="introduction">한줄 소개 *</label>
        <input
          type="text"
          id="introduction"
          name="introduction"
          value={formData.introduction}
          onChange={onInputChange}
          placeholder="자신을 한줄로 소개해주세요"
          maxLength={100}
        />
        <span className="char-count-gathering">{formData.introduction.length}/100</span>
      </div>
    </div>
  );
};

export default GatheringCreateLeaderSection;
