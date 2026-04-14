import React from 'react';

const MyProfileImageSection = ({
  editMode,
  currentImageUrl,
  fileInputRef,
  onFileSelect,
  selectedFile,
  uploadError,
}) => {
  return (
    <div className="field-group">
      <label>프로필 이미지</label>
      <div className="profile-image-section">
        <div className="current-image">
          <img src={currentImageUrl} alt="프로필 이미지" className="profile-image-preview" />
        </div>

        {editMode && (
          <div className="image-upload-section">
            <div className="file-upload-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileSelect}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                className="file-input"
                id="profile-image-input"
              />
              <label htmlFor="profile-image-input" className="file-upload-label">
                이미지 선택
              </label>
            </div>

            {selectedFile && (
              <div className="selected-file-info">
                <p>선택된 파일: {selectedFile.name}</p>
                <p>파일 크기: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB</p>
              </div>
            )}

            {uploadError && (
              <div className="upload-error" style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                {uploadError}
              </div>
            )}

            <p className="image-help-text">
              JPG, PNG, GIF 파일 (최대 5MB)
              <br />
              이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfileImageSection;
