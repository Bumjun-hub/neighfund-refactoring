import React from 'react';

const MyProfileEditHeader = ({ editMode, onStartEdit }) => {
  return (
    <div className="mypage-header">
      <h1>프로필 편집</h1>
      {!editMode && (
        <button onClick={onStartEdit} className="edit-button1">
          편집
        </button>
      )}
    </div>
  );
};

export default MyProfileEditHeader;
