import React from 'react';

const MyProfileEditActions = ({ editMode, onCancel, onSave, disabled }) => {
  if (!editMode) return null;

  return (
    <div className="action-buttons">
      <button onClick={onCancel} className="cancel-button1">
        취소
      </button>
      <button onClick={onSave} className="save-button" disabled={disabled}>
        저장
      </button>
    </div>
  );
};

export default MyProfileEditActions;
