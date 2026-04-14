import React from 'react';

const LoginForm = ({ formData, error, loading, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="signup-form">
      <div className="input-group">
        <label htmlFor="email" className="input-label">
          이메일 주소
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="example@email.com"
          className="input-field"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="password" className="input-label">
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="비밀번호를 입력해주세요"
          className="input-field"
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="signup-button" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
};

export default LoginForm;
