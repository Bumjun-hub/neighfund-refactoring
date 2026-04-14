import React from 'react';
import AddressInput from '../../memberpage/AddressInput';

const MyProfileFields = ({ editMode, profile, editData, phoneError, onInputChange }) => {
  return (
    <>
      <div className="field-group">
        <label>사용자명</label>
        {editMode ? (
          <input
            type="text"
            value={editData.name || ''}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="사용자명을 입력하세요"
          />
        ) : (
          <span>{profile.name || '설정되지 않음'}</span>
        )}
      </div>

      <div className="field-group">
        <label>이메일</label>
        {editMode ? (
          <input
            type="email"
            value={editData.email || ''}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="이메일을 입력하세요"
            disabled
          />
        ) : (
          <span>{profile.email || '설정되지 않음'}</span>
        )}
      </div>

      <div className="field-group">
        <label>전화번호</label>
        {editMode ? (
          <div>
            <input
              type="tel"
              value={editData.phone || ''}
              onChange={(e) => onInputChange('phone', e.target.value)}
              placeholder="010-1234-5678 ( - 제외하고 입력 )"
              maxLength="13"
            />
            {phoneError && (
              <small
                className="phone-error"
                style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}
              >
                {phoneError}
              </small>
            )}
          </div>
        ) : (
          <span>{profile.phone || '설정되지 않음'}</span>
        )}
      </div>

      <div className="field-group">
        <label>주소</label>
        {editMode ? (
          <AddressInput
            address={editData.address || ''}
            detailAddress={editData.detailAddress || ''}
            onAddressChange={(address) => onInputChange('address', address)}
            onDetailAddressChange={(detailAddress) => onInputChange('detailAddress', detailAddress)}
            label=""
            editMode={true}
            className=""
          />
        ) : (
          <span>{`${profile.address} ${profile.detailAddress}`.trim() || '설정되지 않음'}</span>
        )}
      </div>
    </>
  );
};

export default MyProfileFields;
