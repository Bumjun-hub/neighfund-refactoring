import React from 'react';

const ClassListHeader = ({ onCreateClass, onGoToAdmin }) => {
  return (
    <header className="page-header">
      <div className="header-content">
        <div className="header-buttons">
          <button onClick={onCreateClass} className="create-class-btn">
            + 클래스 개설하기
          </button>

          <button onClick={onGoToAdmin} className="admin-page-btn">
            ⚙️ 관리자
          </button>
        </div>
      </div>
    </header>
  );
};

export default ClassListHeader;
