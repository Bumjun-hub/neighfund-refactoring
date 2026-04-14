export const getReservationStatusText = (status) => {
  switch (status) {
    case 'PENDING':
      return '결제 대기';
    case 'PAID':
      return '결제 완료';
    case 'CONFIRMED':
      return '예약 확정';
    case 'COMPLETED':
      return '수강 완료';
    case 'CANCELLED':
      return '취소됨';
    case 'REFUNDED':
      return '환불됨';
    default:
      return status;
  }
};

export const getReservationStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return '#ffc107';
    case 'PAID':
      return '#59a9ffff';
    case 'CONFIRMED':
      return '#28a745';
    case 'COMPLETED':
      return '#6f42c1';
    case 'CANCELLED':
      return '#dc3545';
    case 'REFUNDED':
      return '#6c757d';
    default:
      return '#6c757d';
  }
};

export const formatReservationDateTime = (date, startTime) => {
  if (!date) return 'N/A';

  try {
    const dateStr = new Date(date).toLocaleDateString('ko-KR');
    const timeStr = startTime || '';
    return timeStr ? `${dateStr} ${timeStr}` : dateStr;
  } catch (error) {
    return 'N/A';
  }
};
