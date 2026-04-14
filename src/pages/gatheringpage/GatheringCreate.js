import React, { useEffect, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GatheringAPI from './GatheringAPI';
import './GatheringCreate.css';
import { GATHERING_CREATE_CATEGORIES } from './components/gatheringCreateConstants';
import GatheringCreateBasicSection from './components/GatheringCreateBasicSection';
import GatheringCreateDescriptionSection from './components/GatheringCreateDescriptionSection';
import GatheringCreateLeaderSection from './components/GatheringCreateLeaderSection';
import GatheringCreateImagesSection from './components/GatheringCreateImagesSection';
import GatheringCreateActions from './components/GatheringCreateActions';

const GatheringCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 수정 모드인지 확인
  const isEditMode = location.state?.isEdit || false;
  const gatheringId = location.state?.gatheringId;
  const initialData = location.state?.gatheringData;

  const initialFormState = {
    formData: {
      title: '',
      category: '',
      type: 'FREE',
      dongName: '',
      content: '',
      introduction: '',
      nickname: ''
    },
    titleImage: null,
    profileImage: null,
    titleImagePreview: null,
    profileImagePreview: null,
    isLoading: false,
    error: null,
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case 'SET_FORM_DATA':
        return { ...state, formData: action.payload };
      case 'SET_FIELD':
        return { ...state, formData: { ...state.formData, [action.payload.name]: action.payload.value } };
      case 'SET_TITLE_IMAGE':
        return { ...state, titleImage: action.payload.file, titleImagePreview: action.payload.preview };
      case 'SET_PROFILE_IMAGE':
        return { ...state, profileImage: action.payload.file, profileImagePreview: action.payload.preview };
      case 'REMOVE_TITLE_IMAGE':
        return { ...state, titleImage: null, titleImagePreview: null };
      case 'REMOVE_PROFILE_IMAGE':
        return { ...state, profileImage: null, profileImagePreview: null };
      case 'SET_LOADING':
        return { ...state, isLoading: action.payload };
      case 'SET_ERROR':
        return { ...state, error: action.payload };
      case 'RESET_CREATE_FORM':
        return {
          ...state,
          formData: {
            title: '',
            category: '',
            type: 'FREE',
            dongName: '',
            content: '',
            introduction: '',
            nickname: ''
          },
          titleImage: null,
          profileImage: null,
          titleImagePreview: null,
          profileImagePreview: null,
        };
      default:
        return state;
    }
  };

  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  const {
    formData,
    titleImage,
    profileImage,
    titleImagePreview,
    profileImagePreview,
    isLoading,
    error,
  } = formState;

  // 수정 모드일 때 초기 데이터 설정
  useEffect(() => {
    if (isEditMode && initialData) {
      dispatch({
        type: 'SET_FORM_DATA',
        payload: {
        title: initialData.title || '',
        category: initialData.category || '',
        type: initialData.type || 'FREE',
        dongName: initialData.dongName || '',
        content: initialData.content || '',
        introduction: '', // 수정 시에는 기존 소개글 없음
        nickname: '' // 수정 시에는 기존 닉네임 없음
      }});
      
      // 기존 이미지가 있으면 미리보기로 설정
      if (initialData.titleImage) {
        dispatch({
          type: 'SET_TITLE_IMAGE',
          payload: { file: null, preview: initialData.titleImage }
        });
      }
    }
  }, [isEditMode, initialData]);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FIELD', payload: { name, value } });
  };

  // 제목 이미지 변경 핸들러
  const handleTitleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch({
          type: 'SET_TITLE_IMAGE',
          payload: { file, preview: event.target.result }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch({
          type: 'SET_PROFILE_IMAGE',
          payload: { file, preview: event.target.result }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 제거 핸들러
  const removeTitleImage = () => {
    dispatch({ type: 'REMOVE_TITLE_IMAGE' });
    document.getElementById('titleImageInput').value = '';
  };

  const removeProfileImage = () => {
    dispatch({ type: 'REMOVE_PROFILE_IMAGE' });
    document.getElementById('profileImageInput').value = '';
  };

  // 폼 검증
  const validateForm = () => {
    const { title, category, dongName, content } = formData;
    
    if (!title.trim()) {
      dispatch({ type: 'SET_ERROR', payload: '소모임 제목을 입력해주세요.' });
      return false;
    }
    if (!category) {
      dispatch({ type: 'SET_ERROR', payload: '카테고리를 선택해주세요.' });
      return false;
    }
    if (!dongName.trim()) {
      dispatch({ type: 'SET_ERROR', payload: '지역(동네명)을 입력해주세요.' });
      return false;
    }
    if (!content.trim()) {
      dispatch({ type: 'SET_ERROR', payload: '소모임 설명을 입력해주세요.' });
      return false;
    }

    // 수정 모드가 아닐 때만 필수 체크
    if (!isEditMode) {
      const { introduction, nickname } = formData;
      if (!introduction.trim()) {
        dispatch({ type: 'SET_ERROR', payload: '한줄 소개를 입력해주세요.' });
        return false;
      }
      if (!nickname.trim()) {
        dispatch({ type: 'SET_ERROR', payload: '소모임 닉네임을 입력해주세요.' });
        return false;
      }
    }

    return true;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      if (isEditMode) {
        // 수정 모드
        const editData = {
          title: formData.title,
          category: formData.category,
          dongName: formData.dongName,
          content: formData.content,
          titleImage
        };

        await GatheringAPI.editGathering(gatheringId, editData);
        alert('소모임이 성공적으로 수정되었습니다!');
        
        // 상세 페이지로 이동
        navigate(`/gathering/${gatheringId}`);
        
      } else {
        // 생성 모드
        const gatheringData = {
          ...formData,
          titleImage,
          profileImage
        };

        await GatheringAPI.createGathering(gatheringData);
        alert('소모임이 성공적으로 생성되었습니다!');
        
        // 폼 초기화
        dispatch({ type: 'RESET_CREATE_FORM' });
        
        // 목록 페이지로 이동
        navigate('/gathering');
      }
      
    } catch (error) {
      console.error('소모임 처리 실패:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || `소모임 ${isEditMode ? '수정' : '생성'}에 실패했습니다.` });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className="gathering-create-container">
      <div className="create-form-wrapper">
        <h1 className="create-title">
          {isEditMode ? '소모임 수정하기' : '새로운 소모임 만들기'}
        </h1>
        
        <form onSubmit={handleSubmit} className="create-form">
          <GatheringCreateBasicSection
            formData={formData}
            categories={GATHERING_CREATE_CATEGORIES}
            onInputChange={handleInputChange}
          />

          <GatheringCreateDescriptionSection content={formData.content} onInputChange={handleInputChange} />

          <GatheringCreateLeaderSection
            isEditMode={isEditMode}
            formData={formData}
            onInputChange={handleInputChange}
          />

          <GatheringCreateImagesSection
            isEditMode={isEditMode}
            titleImagePreview={titleImagePreview}
            profileImagePreview={profileImagePreview}
            onRemoveTitleImage={removeTitleImage}
            onRemoveProfileImage={removeProfileImage}
            onTitleImageChange={handleTitleImageChange}
            onProfileImageChange={handleProfileImageChange}
          />

          {/* 에러 메시지 */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <GatheringCreateActions
            isEditMode={isEditMode}
            isLoading={isLoading}
            onCancel={() => {
              if (isEditMode) {
                navigate(`/gathering/${gatheringId}`);
              } else {
                window.history.back();
              }
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default GatheringCreate;