import { httpClient } from '../../api/httpClient';

const API_BASE_URL = '/api/community';

class SuggestionAPI {
    // 제안글 전체 조회
    async getAllSuggestions() {
        return httpClient.get(`${API_BASE_URL}/view`);
    }

    // 제안글 상세 조회
    async getSuggestionDetail(id) {
        return httpClient.get(`${API_BASE_URL}/detail/${id}`);
    }

    // 제안글 작성
    async createSuggestion(data) {
        return httpClient.post(`${API_BASE_URL}/write`, data);
    }


    // 제안글 수정
    async updateSuggestion(id, data) {
        return httpClient.put(`${API_BASE_URL}/edit/${id}`, data);
    }

    // 제안글 삭제
    async deleteSuggestion(id) {
        return httpClient.delete(`${API_BASE_URL}/delete/${id}`);
    }

    // 현재 로그인된 사용자 정보 조회
    async getCurrentUser() {
        return httpClient.get('/api/auth/mypage'); // 이 응답에는 username이 포함되어 있어
    }


    // 좋아요 토글
    async toggleLike(id) {
        return httpClient.post(`/api/likes/COMMUNITY/${id}`); // { liked: true or false }
    }

}

export default new SuggestionAPI();
