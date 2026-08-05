import { api } from "./client";

export const sightingsApi = {
  byReport: (reportId) => api.get(`/reportes/${reportId}/avistamientos`),
  create: (reportId, data) => api.post(`/reportes/${reportId}/avistamientos`, data),
};
