import React, { useEffect, useReducer, useState } from 'react';
import './VendorGatheringDetail.css';
import { createVendorReservation, getVendorClassDetail } from './vendorGatheringApi';
import { getVendorCategoryInKorean } from './components/vendorGatheringDetailFormatters';
import VendorGatheringDetailState from './components/VendorGatheringDetailState';
import VendorGatheringHeader from './components/VendorGatheringHeader';
import VendorGatheringImageGallery from './components/VendorGatheringImageGallery';
import VendorGatheringInfoSections from './components/VendorGatheringInfoSections';
import VendorGatheringReservationCard from './components/VendorGatheringReservationCard';

const VendorGatheringDetail = ({ gatheringId, onBack }) => {
  const initialReservationFormState = {
    availableSlots: [],
    selectedDate: '',
    participantCount: 1,
    paymentBank: '',
    paymentName: '',
  };

  const reservationFormReducer = (state, action) => {
    switch (action.type) {
      case 'SET_DATE_AND_SLOTS':
        return {
          ...state,
          selectedDate: action.payload.date,
          availableSlots: action.payload.slots,
        };
      case 'SET_PARTICIPANT_COUNT':
        return { ...state, participantCount: action.payload };
      case 'SET_PAYMENT_BANK':
        return { ...state, paymentBank: action.payload };
      case 'SET_PAYMENT_NAME':
        return { ...state, paymentName: action.payload };
      case 'RESET_FORM':
        return initialReservationFormState;
      default:
        return state;
    }
  };

  const [gathering, setGathering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservationFormState, dispatch] = useReducer(reservationFormReducer, initialReservationFormState);
  const [selectedTime, setSelectedTime] = useState('');
  const [showReservationForm, setShowReservationForm] = useState(false);

  // 실제 API에서 데이터 가져오기
  useEffect(() => {
    const fetchGatheringDetail = async () => {
      setLoading(true);
      try {
        const data = await getVendorClassDetail(gatheringId);
        
        setGathering({
          id: data.id,
          title: data.title,
          description: data.content, 
          price: data.productPrice,
          maxParticipants: data.maxParticipants,
          duration: data.durationHours ? `${data.durationHours}시간` : "미정",
          location: data.dongName, 
          instructor: data.writerName || "강사명 미정",
          instructorPhone: data.writerPhone || "연락처 미정",
          instructorEmail: data.writerEmail || "이메일 미정",
          materials: data.materials || [], 
          
          // 이미지 처리 수정
          titleImage: data.titleImage, 
          productImages: data.productImages || [], 
          images: [
            data.titleImage, 
            ...(data.productImages || []).map(img => img.imageUrl || img) 
          ].filter(Boolean), 
          
          status: data.status,
          productName: data.productName,
          freeParking: data.freeParking,
          category: data.category,
          categoryKorean: getVendorCategoryInKorean(data.category) 
        });
        
      } catch (error) {
        console.error('Error fetching gathering details:', error);
        setGathering(null);
      } finally {
        setLoading(false);
      }
    };

    if (gatheringId) {
      fetchGatheringDetail();
    }
  }, [gatheringId]);

  // 예약 가능한 시간대 생성 (샘플)
  const generateAvailableSlots = (date) => {
    const slots = [];
    const startHour = 10;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3, // 랜덤으로 예약 가능 여부
        currentParticipants: Math.floor(Math.random() * 4)
      });
    }
    return slots;
  };

  const handleDateChange = (date) => {
    dispatch({
      type: 'SET_DATE_AND_SLOTS',
      payload: { date, slots: generateAvailableSlots(date) },
    });
    setSelectedTime('');
  };

  const handleReservation = async () => {
    const { selectedDate, participantCount, paymentBank, paymentName } = reservationFormState;
    if (!selectedDate || !selectedTime || !paymentBank || !paymentName) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // endTime 계산 (1시간 후)
    const startTimeDate = new Date(`2000-01-01T${selectedTime}:00`);
    const endTimeDate = new Date(startTimeDate.getTime() + (60 * 60 * 1000)); // 1시간 추가
    const endTimeString = endTimeDate.toTimeString().substr(0, 5); // HH:MM 형식

    const reservationData = {
      gatheringId: gathering.id,
      date: selectedDate,
      startTime: selectedTime,
      endTime: endTimeString, // endTime 추가
      participantCount,
      paymentBank,
      paymentName
    };

    try {
      const result = await createVendorReservation(gatheringId, reservationData);
      alert(result || "원데이클래스가 예약되었습니다."); // "원데이클래스가 예약되었습니다." 메시지
      setShowReservationForm(false);
      
      // 폼 초기화
      dispatch({ type: 'RESET_FORM' });
      setSelectedTime('');
    } catch (error) {
      console.error('Reservation error:', error);
      
      // 에러 메시지 파싱
      let errorMessage = '예약 중 오류가 발생했습니다.';
      errorMessage = error?.data?.message || error?.message || errorMessage;
      
      alert(errorMessage);
    }
  };

  if (loading) {
    return <VendorGatheringDetailState type="loading" />;
  }

  if (!gathering) {
    return <VendorGatheringDetailState type="error" />;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="vendor-detail-container">
      <VendorGatheringHeader gathering={gathering} />
      <VendorGatheringImageGallery gathering={gathering} />

      <div className="vendor-detail-layout">
        <VendorGatheringInfoSections gathering={gathering} />

        <VendorGatheringReservationCard
          gathering={gathering}
          today={today}
          showReservationForm={showReservationForm}
          onShowForm={() => setShowReservationForm(true)}
          selectedDate={reservationFormState.selectedDate}
          onDateChange={handleDateChange}
          availableSlots={reservationFormState.availableSlots}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          participantCount={reservationFormState.participantCount}
          onParticipantCountChange={(count) => dispatch({ type: 'SET_PARTICIPANT_COUNT', payload: count })}
          paymentBank={reservationFormState.paymentBank}
          onPaymentBankChange={(bank) => dispatch({ type: 'SET_PAYMENT_BANK', payload: bank })}
          paymentName={reservationFormState.paymentName}
          onPaymentNameChange={(name) => dispatch({ type: 'SET_PAYMENT_NAME', payload: name })}
          onCancel={() => setShowReservationForm(false)}
          onSubmit={handleReservation}
        />
      </div>
    </div>
  );
};

export default VendorGatheringDetail;