import React from 'react';

const LoginSocialSection = ({ onSocialLogin }) => {
  return (
    <>
      <div className="social-login-section">
        <button
          type="button"
          onClick={() => onSocialLogin('google')}
          className="social-login-button google"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4" />
            <path fillRule="evenodd" clipRule="evenodd" d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853" />
            <path fillRule="evenodd" clipRule="evenodd" d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59307 3.68182 8.99989C3.68182 8.40671 3.78409 7.82989 3.96409 7.28989V4.95807H0.957273C0.347727 6.17353 0 7.54898 0 8.99989C0 10.4508 0.347727 11.8262 0.957273 13.0417L3.96409 10.7098Z" fill="#FBBC05" />
            <path fillRule="evenodd" clipRule="evenodd" d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335" />
          </svg>
          Google로 로그인
        </button>
      </div>

      <div className="divider">
        <span>또는</span>
      </div>
    </>
  );
};

export default LoginSocialSection;
