import { httpClient } from '../../api/httpClient';

export const getVendorClassList = () => httpClient.get('/api/gatherings/vendor/list');

export const getVendorClassDetail = (gatheringId) =>
  httpClient.get(`/api/gatherings/vendor/detail/${gatheringId}`);

export const createVendorReservation = (gatheringId, payload) =>
  httpClient.post(`/api/gatherings/vendor/reservation/${gatheringId}`, payload);

export const createVendorGathering = (formData) =>
  httpClient.post('/api/gatherings/vendor/create', formData);

export const updateVendorGatheringDetails = (gatheringId, formData) =>
  httpClient.post(`/api/gatherings/vendor/${gatheringId}/updateDetails`, formData);

export const getVendorAdminGatherings = () =>
  httpClient.get('/api/gatherings/vendor/admin/vendor-gatherings');

export const getVendorAdminReservations = () =>
  httpClient.get('/api/gatherings/vendor/admin/reservations');

export const approveVendorGathering = (id) =>
  httpClient.put(`/api/gatherings/vendor/admin/vendor-gatherings/${id}/approve`);

export const rejectVendorGathering = (id) =>
  httpClient.put(`/api/gatherings/vendor/admin/vendor-gatherings/${id}/reject`);

export const deleteVendorGathering = (id) =>
  httpClient.delete(`/api/gatherings/vendor/gathering/${id}`);

export const updateVendorReservationStatus = (reservationId, status) =>
  httpClient.put(`/api/gatherings/vendor/admin/reservations/${reservationId}/status`, { status });

