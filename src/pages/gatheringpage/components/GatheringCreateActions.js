import React from 'react';

const GatheringCreateActions = ({ isEditMode, isLoading, onCancel }) => {
  return (
    <div className="form-actions">
      <button type="button" className="cancel-btn" onClick={onCancel}>
        취소
      </button>
      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? (isEditMode ? '수정 중...' : '생성 중...') : isEditMode ? '소모임 수정하기' : '소모임 만들기'}
      </button>
    </div>
  );
};

export default GatheringCreateActions;
