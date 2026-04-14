import React from 'react';

const VendorGatheringImageGallery = ({ gathering }) => {
  return (
    <>
      {gathering.titleImage && (
        <div className="vendor-detail-main-image">
          <img
            src={gathering.titleImage}
            alt={gathering.title}
            className="vendor-detail-image"
            onError={(e) => {
              console.error('메인 이미지 로드 실패:', gathering.titleImage);
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {gathering.productImages && gathering.productImages.length > 0 && (
        <div className="vendor-detail-gallery">
          <h3 className="vendor-detail-section-title">추가 이미지</h3>
          <div className="vendor-detail-gallery-grid">
            {gathering.productImages.map((image, index) => (
              <div key={index}>
                <img
                  src={image.imageUrl || image}
                  alt={`추가 이미지 ${index + 1}`}
                  className="vendor-detail-image"
                  onError={(e) => {
                    console.error('추가 이미지 로드 실패:', image);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default VendorGatheringImageGallery;
