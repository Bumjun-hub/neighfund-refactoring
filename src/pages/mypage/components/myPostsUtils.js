export const TAB = {
  WRITTEN: 'written',
  LIKED: 'liked',
  FUND: 'fund',
  GATHERING: 'gathering',
  CLASS: 'class',
};

export const getProfileImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  return `http://localhost:8080${imageUrl}?t=${Date.now()}`;
};

export const getReservationStatusText = (status) => {
  if (status === 'PAID') return '✅ 결제완료';
  if (status === 'PENDING') return '⏳ 입금대기';
  if (status === 'CANCELLED') return '❌ 취소됨';
  return status;
};
