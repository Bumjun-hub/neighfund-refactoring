import { httpClient } from '../../api/httpClient';

export const getMyProfile = () => httpClient.get('/api/auth/mypage');

export const uploadMyProfileImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return httpClient.post('/api/auth/mypage/upload', formData);
};

export const updateMyProfile = (payload) => httpClient.put('/api/auth/mypage/editProfile', payload);

