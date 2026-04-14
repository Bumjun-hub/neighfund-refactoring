import React from 'react';

const LoginSignupLink = ({ onSignupClick }) => {
  return (
    <div className="signup-link">
      <span>아직 계정이 없으신가요? </span>
      <button type="button" onClick={onSignupClick} className="signup-button2">
        회원가입
      </button>
    </div>
  );
};

export default LoginSignupLink;
