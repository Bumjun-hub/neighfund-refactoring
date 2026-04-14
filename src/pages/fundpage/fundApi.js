import { httpClient } from '../../api/httpClient';

export const getFundList = () => httpClient.get('/api/fund/view');

export const getRoleInfo = () => httpClient.get('/api/auth/roleinfo');

export const getSurveyList = () => httpClient.get('/api/survey/view');

export const getFundDetail = (id) => httpClient.get(`/api/fund/view/${id}`);

export const deleteFund = (id, token) =>
  httpClient.delete(`/api/fund/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getMyOrderList = () =>
  httpClient.get('/api/orders/myPage/order');

export const createFund = (formData, token) =>
  httpClient.post('/api/fund/write', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createFundOrder = (optionId, payload, token) =>
  httpClient.post(`/api/orders/${optionId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

