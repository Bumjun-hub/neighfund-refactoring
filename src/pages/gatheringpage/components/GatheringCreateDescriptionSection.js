import React from 'react';

const GatheringCreateDescriptionSection = ({ content, onInputChange }) => {
  return (
    <div className="form-section">
      <h2 className="section-title">소모임 설명</h2>

      <div className="form-group">
        <label htmlFor="content">소모임 소개 *</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={onInputChange}
          placeholder="소모임에 대해 자세히 설명해주세요"
          rows={6}
          maxLength={1000}
        />
        <span className="char-count-gathering">{content.length}/1000</span>
      </div>
    </div>
  );
};

export default GatheringCreateDescriptionSection;
