import React from 'react';

const GatheringCreateBasicSection = ({ formData, categories, onInputChange }) => {
  return (
    <div className="form-section">
      <h2 className="section-title">기본 정보</h2>

      <div className="form-group">
        <label htmlFor="title">소모임 제목 *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          placeholder="소모임 제목을 입력하세요"
          maxLength={50}
        />
        <span className="char-count-gathering">{formData.title.length}/50</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">카테고리 *</label>
          <select id="category" name="category" value={formData.category} onChange={onInputChange}>
            <option value="">카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dongName">지역 (동네명) *</label>
        <input
          type="text"
          id="dongName"
          name="dongName"
          value={formData.dongName}
          onChange={onInputChange}
          placeholder="예: 강남구 역삼동"
        />
      </div>
    </div>
  );
};

export default GatheringCreateBasicSection;
