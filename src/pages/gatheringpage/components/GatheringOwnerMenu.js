import React from 'react';

const GatheringOwnerMenu = ({ menuRef, isMenuOpen, onToggleMenu, onEdit, onDelete }) => {
  return (
    <div className="header-actions">
      <div className="owner-actions">
        <div className="menu-container" ref={menuRef}>
          <button onClick={onToggleMenu} className="menu-button">
            ⋮
          </button>
          {isMenuOpen && (
            <div className="dropdown-menu">
              <button onClick={onEdit} className="menu-item">
                ✏️ 수정
              </button>
              <button onClick={onDelete} className="menu-item">
                🗑️ 삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GatheringOwnerMenu;
