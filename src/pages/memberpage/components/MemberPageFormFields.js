import React from 'react';
import AddressInput from '../AddressInput';

const MemberPageFormFields = ({
  formData,
  onChange,
  onAddressChange,
  onDetailAddressChange,
}) => {
  return (
    <>
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
        <label htmlFor="username" className="input-label">
          사용자명
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={onChange}
          placeholder="사용자명을 입력해주세요"
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
          placeholder="4자 이상 입력해주세요"
          className="input-field"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="confirmPassword" className="input-label">
          비밀번호 확인
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          placeholder="비밀번호를 다시 입력해주세요"
          className="input-field"
          required
        />
      </div>

      <AddressInput
        address={formData.address}
        detailAddress={formData.detailAddress}
        onAddressChange={onAddressChange}
        onDetailAddressChange={onDetailAddressChange}
        label="주소 (선택)"
        className="input-group"
      />

      <div className="input-group">
        <label htmlFor="phone" className="input-label">
          전화번호 (선택)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="010-1234-5678 (- 제외하고 입력)"
          className="input-field"
          maxLength="13"
        />
        {formData.phone && formData.phone.length > 0 && formData.phone.length !== 13 && (
          <small className="input-hint" style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
            전화번호 형식이 맞지 않습니다. (현재: {formData.phone.length}자리)
          </small>
        )}
      </div>
    </>
  );
};

export default MemberPageFormFields;
