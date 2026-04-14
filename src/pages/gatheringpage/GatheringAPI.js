// services/gatheringApi.js
import { httpClient } from '../../api/httpClient';

const API_BASE_URL = '/api';

class GatheringAPI {
  // 소모임 목록 조회 (인증 불필요)
  async getGatheringList() {
    const data = await httpClient.get(`${API_BASE_URL}/gatherings/free/list`);
    if (!Array.isArray(data)) {
      throw new Error('소모임 목록 응답 형식이 올바르지 않습니다.');
    }
    return data;
  }

  // 소모임 상세 조회
  async getGatheringDetail(id) {
    // 캐시 방지를 위한 타임스탬프 추가
    const timestamp = new Date().getTime();
    const urlWithTimestamp = `${API_BASE_URL}/gatherings/free/detail/${id}?_t=${timestamp}`;

    return httpClient.get(urlWithTimestamp);
  }

  // 소모임 생성
  async createGathering(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    return httpClient.post(`${API_BASE_URL}/gatherings/free/create`, formData);
  }

  // 소모임 참여
  async joinGathering(gatheringId, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    return httpClient.post(`${API_BASE_URL}/gatherings/free/${gatheringId}/join`, formData);
  }

  // 소모임 수정
  async editGathering(id, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    return httpClient.put(`${API_BASE_URL}/gatherings/free/edit/${id}`, formData);
  }

  // 소모임 삭제
  async deleteGathering(id) {
    return httpClient.delete(`${API_BASE_URL}/gatherings/free/delete/${id}`);
  }

  // ==================== 게시판 관련 메서드 ====================

  // 게시글 목록 조회
  async getPosts(gatheringId) {
    return httpClient.get(`${API_BASE_URL}/gatherings/free/${gatheringId}/getPosts`);
  }

  // 게시글 상세보기
  async getPostDetail(gatheringId, postId) {
    return httpClient.get(`${API_BASE_URL}/gatherings/free/${gatheringId}/detail/${postId}`);
  }

  // 게시글 작성
  async createPost(gatheringId, title, content, category, images = []) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);

    // 이미지 파일들 추가
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return httpClient.post(`${API_BASE_URL}/gatherings/free/${gatheringId}/create/posts`, formData);
  }

  // 게시글 수정
  async editPost(gatheringId, postId, title, content, images = []) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // 이미지 파일들 추가
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return httpClient.put(`${API_BASE_URL}/gatherings/free/${gatheringId}/edit/${postId}`, formData);
  }

  

  async getCurrentUser() {
    return httpClient.get(`${API_BASE_URL}/auth/mypage`);
  }

  // 소모임 멤버십 확인 (프론트엔드에서 계산)
  async checkMembership(gatheringId) {
    try {
      const [gathering, currentUser] = await Promise.all([
        this.getGatheringDetail(gatheringId),
        this.getCurrentUser()
      ]);

      if (!currentUser || !gathering) {
        return false;
      }

      // 1. 소모임 생성자인지 확인
      if (gathering.creator && gathering.creator.username === currentUser.username) {
        return true;
      }

      // 2. 소모임 멤버 목록에 있는지 확인
      if (gathering.members && gathering.members.length > 0) {
        return gathering.members.some(member => 
          member.username === currentUser.username
        );
      }

      // 3. 참여자 목록이 있다면 확인 (API 응답 구조에 따라 조정)
      if (gathering.participants && gathering.participants.length > 0) {
        return gathering.participants.some(participant => 
          participant.username === currentUser.username
        );
      }

      return false;
    } catch (error) {
      console.error('checkMembership error:', error);
      return false; // 에러 시 false 반환
    }
  }

  // 사진 업로드
  async uploadPhoto(gatheringId, image) {
    const formData = new FormData();
    formData.append('image', image);

    return httpClient.post(`${API_BASE_URL}/gatherings/free/${gatheringId}/photos`, formData);
  }

  // 사진 목록 조회
  async getPhotos(gatheringId) {
    return httpClient.get(`${API_BASE_URL}/gatherings/free/${gatheringId}/photos`);
  }
}


export default new GatheringAPI();