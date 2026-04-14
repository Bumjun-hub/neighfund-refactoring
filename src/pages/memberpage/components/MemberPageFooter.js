import React from 'react';

const MemberPageFooter = ({ loading, onLoginClick }) => {
  return (
    <>
      <button type="submit" className="signup-button" disabled={loading}>
        {loading ? '가입 중...' : '회원가입'}
      </button>

      <div className="login-link">
        <span>이미 계정이 있으신가요? </span>
        <button type="button" onClick={onLoginClick} className="login-button-link">
          로그인
        </button>
      </div>
    </>
  );
};

export default MemberPageFooter;
