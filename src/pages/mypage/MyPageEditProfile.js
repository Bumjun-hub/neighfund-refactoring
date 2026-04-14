import React, { useMemo, useReducer, useRef, useState } from 'react';
import './MyPageEditProfile.css';
import { deleteAccount } from '../../utils/authUtils';
import { getMyProfile, uploadMyProfileImage, updateMyProfile } from './mypageApi';
import MyProfileEditHeader from './components/MyProfileEditHeader';
import MyProfileImageSection from './components/MyProfileImageSection';
import MyProfileFields from './components/MyProfileFields';
import MyProfileEditActions from './components/MyProfileEditActions';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const myProfileQueryClient = new QueryClient();

const initialFormState = {
  editData: {},
  phoneError: '',
  selectedFile: null,
  previewUrl: '',
  uploadError: '',
};

const profileFormReducer = (state, action) => {
  switch (action.type) {
    case 'START_EDIT':
      return {
        ...state,
        editData: action.payload,
        phoneError: '',
        selectedFile: null,
        previewUrl: '',
        uploadError: '',
      };
    case 'CANCEL_EDIT':
    case 'RESET_AFTER_SAVE':
      return initialFormState;
    case 'SET_FIELD':
      return {
        ...state,
        editData: { ...state.editData, [action.payload.field]: action.payload.value },
      };
    case 'SET_PHONE_ERROR':
      return { ...state, phoneError: action.payload };
    case 'SET_SELECTED_FILE':
      return { ...state, selectedFile: action.payload };
    case 'SET_PREVIEW_URL':
      return { ...state, previewUrl: action.payload };
    case 'SET_UPLOAD_ERROR':
      return { ...state, uploadError: action.payload };
    default:
      return state;
  }
};

const MyPageEditProfileContent = () => {
  const [editMode, setEditMode] = useState(false);
  const [formState, dispatch] = useReducer(profileFormReducer, initialFormState);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const parseAddress = (fullAddress) => {
    if (!fullAddress) return { address: '', detailAddress: '' };
    const parts = fullAddress.split(' ');
    if (parts.length > 3) {
      return { 
        address: parts.slice(0, -2).join(' '), 
        detailAddress: parts.slice(-2).join(' ') 
      };
    }
    return { address: fullAddress, detailAddress: '' };
  };

  const profileQuery = useQuery({
    queryKey: ['mypage', 'profile'],
    queryFn: getMyProfile,
    retry: false,
  });

  const profile = useMemo(() => {
    const data = profileQuery.data;
    if (!data) {
      return { name: '', email: '', phone: '', address: '', detailAddress: '', imageUrl: '' };
    }
    const { address, detailAddress } = parseAddress(data.address);
    return {
      name: data.username || data.name,
      email: data.email,
      phone: data.phone,
      address,
      detailAddress,
      imageUrl: data.imageUrl || '/static/profileimages/profile1.jpg',
    };
  }, [profileQuery.data]);

  const startEdit = () => {
    dispatch({ type: 'START_EDIT', payload: { ...profile } });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    dispatch({ type: 'CANCEL_EDIT' });
    // 파일 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
      
      // 전화번호 유효성 검사
      if (value && value.length > 0 && value.length !== 13) {
        dispatch({ type: 'SET_PHONE_ERROR', payload: `전화번호는 13자리로 입력해주세요. (현재: ${value.length}자리)` });
      } else {
        dispatch({ type: 'SET_PHONE_ERROR', payload: '' });
      }
    }
    dispatch({ type: 'SET_FIELD', payload: { field, value } });
  };

  const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 11자리 이상 입력 방지
    if (numbers.length > 11) {
      return formState.editData.phone || '';
    }
    
    // 전화번호 포맷팅 (13자리: 010-1234-5678)
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    dispatch({ type: 'SET_UPLOAD_ERROR', payload: '' });

    if (!file) {
      dispatch({ type: 'SET_SELECTED_FILE', payload: null });
      dispatch({ type: 'SET_PREVIEW_URL', payload: '' });
      return;
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      dispatch({ type: 'SET_UPLOAD_ERROR', payload: 'JPG, PNG, GIF 파일만 업로드 가능합니다.' });
      event.target.value = '';
      return;
    }

    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      dispatch({ type: 'SET_UPLOAD_ERROR', payload: '파일 크기는 5MB 이하로 업로드해주세요.' });
      event.target.value = '';
      return;
    }

    dispatch({ type: 'SET_SELECTED_FILE', payload: file });

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      dispatch({ type: 'SET_PREVIEW_URL', payload: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  const uploadProfileImage = async () => {
    if (!formState.selectedFile) return null;

    try {
      const result = await uploadImageMutation.mutateAsync(formState.selectedFile);
      console.log('이미지 업로드 성공:', result);
      return true;
    } catch (error) {
      console.error('이미지 업로드 중 오류:', error);
      dispatch({ type: 'SET_UPLOAD_ERROR', payload: '이미지 업로드 중 오류가 발생했습니다.' });
      return false;
    }
  };

  const validateForm = () => {
    // 전화번호가 입력되었다면 13자리 검증
    if (formState.editData.phone && formState.editData.phone.length !== 13) {
      dispatch({ type: 'SET_PHONE_ERROR', payload: '전화번호는 13자리로 입력해주세요. (예: 010-1234-5678)' });
      return false;
    }
    dispatch({ type: 'SET_PHONE_ERROR', payload: '' });
    return true;
  };

  const uploadImageMutation = useMutation({
    mutationFn: uploadMyProfileImage,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
  });

  const updateProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // 먼저 이미지 업로드 (선택된 파일이 있는 경우)
      let imageUploadSuccess = true;
      if (formState.selectedFile) {
        imageUploadSuccess = await uploadProfileImage();
        if (!imageUploadSuccess) {
          return; // 이미지 업로드 실패 시 프로필 업데이트 중단
        }
      }

      // 프로필 정보 업데이트
      // 프로필 정보 업데이트
      await updateProfileMutation.mutateAsync({
        name: formState.editData.name,
        email: formState.editData.email,
        phone: formState.editData.phone,
        address: `${formState.editData.address} ${formState.editData.detailAddress}`.trim()
      });
      await queryClient.invalidateQueries({ queryKey: ['mypage', 'profile'] });
      
      setEditMode(false);
      dispatch({ type: 'RESET_AFTER_SAVE' });

      alert('프로필이 성공적으로 업데이트되었습니다.');

      // 프로필 업데이트 후 헤더와 마이페이지의 사용자 정보도 업데이트
      window.dispatchEvent(new Event('authChange'));
      window.dispatchEvent(new Event('profileUpdate'));

    } catch (err) {
      console.error('프로필 업데이트 중 오류:', err);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 회원탈퇴를 하시겠습니까?\n\n탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
      try {
        const result = await deleteAccount();
        if (result.success) {
          alert('회원탈퇴가 완료되었습니다.');
        }
      } catch (error) {
        alert('회원탈퇴 중 오류가 발생했습니다.');
      }
    }
  };

  // 현재 표시할 이미지 URL 결정
  const getCurrentImageUrl = () => {
    if (editMode && formState.previewUrl) {
      return formState.previewUrl; // 새로 선택한 파일의 미리보기
    }
    return profile.imageUrl; // 기존 프로필 이미지
  };

  return (
    <div className="mypage-container">
      <div className="mypage-card">
        <MyProfileEditHeader editMode={editMode} onStartEdit={startEdit} />

        <div className="profile-content">
          <MyProfileImageSection
            editMode={editMode}
            currentImageUrl={getCurrentImageUrl()}
            fileInputRef={fileInputRef}
            onFileSelect={handleFileSelect}
            selectedFile={formState.selectedFile}
            uploadError={formState.uploadError}
          />

          <MyProfileFields
            editMode={editMode}
            profile={profile}
            editData={formState.editData}
            phoneError={formState.phoneError}
            onInputChange={handleInputChange}
          />

          <div className="bottom-section">
            <button 
              onClick={handleDeleteAccount}
              className="delete-account-btn"
            >
              회원탈퇴
            </button>
          </div>
        </div>

        <MyProfileEditActions
          editMode={editMode}
          onCancel={cancelEdit}
          onSave={updateProfile}
          disabled={!!formState.phoneError || !!formState.uploadError}
        />
      </div>
    </div>
  );
};

const MyPageEditProfile = () => {
  return (
    <QueryClientProvider client={myProfileQueryClient}>
      <MyPageEditProfileContent />
    </QueryClientProvider>
  );
};

export default MyPageEditProfile;