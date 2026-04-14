import React from 'react';

const GatheringCreateImagesSection = ({
  isEditMode,
  titleImagePreview,
  profileImagePreview,
  onRemoveTitleImage,
  onRemoveProfileImage,
  onTitleImageChange,
  onProfileImageChange,
}) => {
  return (
    <div className="form-section">
      <h2 className="section-title">이미지</h2>

      <div className="form-group">
        <label htmlFor="titleImageInput">소모임 대표 이미지</label>
        <div className="image-upload-area">
          {titleImagePreview ? (
            <div className="image-preview">
              <img src={titleImagePreview} alt="대표 이미지 미리보기" />
              <button type="button" onClick={onRemoveTitleImage} className="remove-image-btn">
                ✕
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <span>📷</span>
              <p>대표 이미지를 선택하세요</p>
            </div>
          )}
          <input type="file" id="titleImageInput" accept="image/*" onChange={onTitleImageChange} hidden />
          <button
            type="button"
            onClick={() => document.getElementById('titleImageInput').click()}
            className="upload-btn"
          >
            이미지 선택
          </button>
        </div>
      </div>

      {!isEditMode && (
        <div className="form-group">
          <label htmlFor="profileImageInput">프로필 이미지</label>
          <div className="image-upload-area profile">
            {profileImagePreview ? (
              <div className="image-preview profile">
                <img src={profileImagePreview} alt="프로필 이미지 미리보기" />
                <button type="button" onClick={onRemoveProfileImage} className="remove-image-btn">
                  ✕
                </button>
              </div>
            ) : (
              <div className="upload-placeholder profile">
                <span>👤</span>
                <p>프로필 이미지를 선택하세요</p>
              </div>
            )}
            <input type="file" id="profileImageInput" accept="image/*" onChange={onProfileImageChange} hidden />
            <button
              type="button"
              onClick={() => document.getElementById('profileImageInput').click()}
              className="upload-btn"
            >
              이미지 선택
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GatheringCreateImagesSection;
