import React from 'react';

const MemberPageAgreement = ({ agreed, onChange }) => {
  return (
    <div className="agreement-section">
      <label className="agreement-label">
        <input
          type="checkbox"
          checked={agreed}
          onChange={onChange}
          className="agreement-checkbox"
        />
        <span className="agreement-text">이용약관 및 개인정보처리방침에 동의합니다</span>
      </label>
    </div>
  );
};

export default MemberPageAgreement;
