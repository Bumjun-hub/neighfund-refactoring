import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';

const VendorGatheringHeader = ({ gathering }) => {
  return (
    <div className="vendor-detail-header">
      <h1 className="vendor-detail-title">{gathering.title}</h1>
      <div className="vendor-detail-meta">
        <div className="vendor-detail-meta-item">
          <MapPin className="vendor-detail-meta-icon" />
          <span>{gathering.location}</span>
        </div>
        <div className="vendor-detail-meta-item">
          <Clock className="vendor-detail-meta-icon" />
          <span>{gathering.duration}</span>
        </div>
        <div className="vendor-detail-meta-item">
          <Users className="vendor-detail-meta-icon" />
          <span>최대 {gathering.maxParticipants}명</span>
        </div>
      </div>
    </div>
  );
};

export default VendorGatheringHeader;
