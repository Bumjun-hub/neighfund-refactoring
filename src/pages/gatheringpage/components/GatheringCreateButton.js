import React from 'react';

const GatheringCreateButton = ({ onCreate }) => {
  return (
    <div className="gathering-header">
      <button className="create-gathering-btn" onClick={onCreate}>
        + 새 소모임 만들기
      </button>
    </div>
  );
};

export default GatheringCreateButton;
